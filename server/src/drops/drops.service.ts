import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Drop } from 'src/models/drop';
import { addDays, addWeeks, addMonths, addYears, addBusinessDays, parseISO, isWithinInterval, parse } from 'date-fns';
import { TagsService } from 'src/tags/tags.service';
import { Cron } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';

import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz';
import * as Realm from "realm";
import { DropSchema, TagSchema, UserSchema } from 'src/models/schema';
import { randomUUID } from 'crypto';
import { Tag } from 'src/models/tag';
import { UserService } from 'src/user/user.service';


@Injectable()
export class DropsService implements OnModuleInit, OnModuleDestroy {
  realm:Realm;

  drops: Drop[] = [];

  constructor(private ts: TagsService, private us: UserService) {
  }


  onModuleDestroy() {
    this.realm.close();
  }

  async onModuleInit() {
    this.realm = await Realm.open({
      path: 'db/oos.realm',
      schema: [DropSchema, TagSchema, UserSchema],
      schemaVersion: 1
    });
  }

    /*
    async testSample():Promise<{result:boolean}> {

      const drops:Drop[] = [];
      
      for (let i=0; i<1000; i++) {

        let d:any = 
          i%6 == 1 ? { money: { value: 10.3, type: "expense", currency: "CHF" } } :
          i%6 == 2 ? { task: { description: "Task To Do Something", date: 0, completed: false } } :
          i%6 == 3 ? { system: { content: "SYSTEM"  } } :
          i%6 == 4 ? { rate: { description: "GOOD thing to Rate", value:  3 } } :
          i%6 == 5 ? { goal: { content: "__This is a Goal__", system: false, completed: false, totals: [2,3,4] } } :
          { note: { content: "__This is a text note__" } };
  
        let dtype =   
          i%6 == 1 ? "MONEY" :
          i%6 == 2 ? "TASK" :
          i%6 == 3 ? "SYS" :
          i%6 == 4 ? "RATE" :
          i%6 == 5 ? "GOAL" : "NOTE";
  
        let dd:Drop = {
          id: this.generateID(),
          type: dtype,
          title: dtype === 'TASK'? `Do Something`: dtype === 'RATE' ? `GOOD` : `This is a ${dtype} drop`,
          recurrence: "day",
          tags: 
            dtype === 'NOTE' ? [ this.ts.get("NOTE"), this.ts.get("HELLO") ] :
            dtype === 'RATE' ? [ this.ts.get("RATE"), this.ts.get("BYE") ] :
            dtype === 'TASK' ? [ this.ts.get("TASK"), this.ts.get("HELLO") ] :
            dtype === 'GOAL' ? [ this.ts.get("GOAL"), this.ts.get("BYE") ] :
            dtype === 'MONEY' ? [ this.ts.get("MONEY"), this.ts.get("HELLO") ] : []
          ,
          date: subHours(endOfYear(Date.now()), i*12 ).getTime(),
          ...d
        };
        drops.push(new Drop(dd));
      }
      
      const r = await Promise.all( drops.map( d => this.create(d)) );

      return Promise.resolve({result: r.length === 1000}); 
    }
    */

    upsert(drop:Drop): Promise<Drop> {
      return new Promise<Drop>((resolve,reject) => {
        this.realm.write(() => {          
          try {
            const tags = drop.tags.map( t => this.realm.create('Tag', t, Realm.UpdateMode.Modified));
            if (drop.type === 'GOAL') {
              const d = this.realm.create<Drop>('Drop', {
                ...drop, 
                content: { 
                  completed: drop.content.completed, 
                  createdAt:Date.now(), 
                  tags: JSON.stringify(drop.content.tags) 
                }, 
                tags: tags
              }, Realm.UpdateMode.Modified);
              
              const nd = d.toJSON();
              nd.content.tags = JSON.parse(nd.content.tags);
              resolve(nd);  
            } else {
              
              const d = this.realm.create<Drop>('Drop', {
                ...drop, 
                tags: tags
              }, Realm.UpdateMode.Modified);
              
              this.updateGoals();
              resolve(d.toJSON());  
            }
          } catch(e) {
            reject(e);
          }
        });
      });

    }

    get(id:string):Promise<Drop> {
      return new Promise<Drop>((resolve,reject) => {
        try {
          const d = this.realm.objectForPrimaryKey<Drop>('Drop', id);
          const nd = d.toJSON();
          if (d.type === 'GOAL') {
            nd.content.tags = JSON.parse(nd.content.tags);
          }
          resolve(nd);
        } catch(e) {
          reject(e);
        }
      });
    }

    delete(id:string):Promise<boolean> {
      return new Promise<boolean>((resolve,reject) => {
        this.realm.write(() => {          
          try {
            const d = this.realm.objectForPrimaryKey<Drop>('Drop', id);
            this.realm.delete(d);
            resolve(true);
          } catch(e) {
            reject(false);
          }
        });
      });
    }

    async findAll():Promise<Drop[]> {
      return new Promise<Drop[]>((resolve,reject) => {
        try {
          const drops = this.realm.objects<Drop>('Drop');
          resolve(drops.map( d => { 
            const nd = d.toJSON();
            if (d.type === 'GOAL') {
              nd.content.tags = JSON.parse(nd.content.tags);
            }
            return new Drop(nd) 
          } ));
        } catch(e) {
          reject(e);
        }
      });
    }

    async findByTags(uid:string, tags:string[]):Promise<Drop[]> {
      //console.log(uid,tags)
      const now = Date.now();
      const tagsQuery = tags.map( t => `tags._id == "${t}"`).join(' AND ');
      const drops = this.realm.objects<Drop>('Drop').filtered(`uid == '${uid}' AND date < ${now} AND (${tagsQuery})`).sorted('date', true);
      return Promise.resolve(drops.map( d => d.toJSON()));
    }

    private async updateGoals() {
      const now = Date.now();

      const out = (d:Drop) => {
        console.log(`drop [${d.type}] [${d.title}]`)
        if (d.tags) console.log(`tags [${ d.tags.map(t => t._id+',' ) }]`)
        if (d.content?.tags) console.log(`tags [${ JSON.parse(d.content.tags).map(t => t.id+',' ) }]`)
      }
      
      const goals = this.realm.objects<Drop>('Drop').filtered('date >= $0 AND type = "GOAL"', now);      

      //console.log("goals")
      //goals.forEach( g => out(g) );

      for (let g of goals) {
        const goal = new Drop(g.toJSON());
        goal.content.tags = JSON.parse(goal.content.tags);
        const goalDate = goal.date;
        const goalCreated:number = goal.content.createdAt;
        const goalTags = goal.content.tags.map( t => t.id);

        const tagsQuery = goalTags.reduce( (acc,v,i) => acc + `${ i == 0 ? '' : 'OR'} tags.name == "${v}" ` ,"");
        const drops = this.realm.objects<Drop>('Drop').filtered(`type <> "GOAL" AND date >= ${goalCreated} AND date < ${goalDate} AND (${tagsQuery})`);
        
        const totals = new Map( goalTags.map( t => [ t, [0,0,0,0,0,0,0,0] ]) )

        //console.log("drops")
        //drops.forEach(d => out(d));

        drops.map(drop => drop.toJSON()).forEach( drop => drop.tags.forEach( tag => {
          // count total type
          const tot = totals.get(tag._id);
          if (tot) {
            switch(drop.type) {
              case "PHOTO" : tot[7]++; break;
              case "NOTE" : tot[6]++; break;
              case "RATE" : tot[4]++; tot[5] += drop.content.value; break;
              case "MONEY" : drop.content.type == 'expense' ? tot[2] += drop.content.value : tot[3] += drop.content.value; break;
              case "TASK" : tot[0]++; tot[1] += drop.content.completed ? 1 : 0; break;
            }
            totals.set(tag._id,tot);
          }
        }))

        goal.content.tags = [...totals.entries()].map( e => ({ id: e[0], totals: e[1]}))
        //console.log(goal.content.tags)
        const d = this.realm.create<Drop>('Drop', {
          ...goal, 
          content: { 
            completed: goal.content.completed,
            createdAt: goal.content.createdAt, 
            tags: JSON.stringify(goal.content.tags) 
          }, 
        }, 
        Realm.UpdateMode.Modified);
      }
    }



        /*
         0 -> totals tasks, 
         1 -> total task completed
         2 -> total expenses
         3 -> total incomes
         4 -> total rates
         5 -> total rate values
         6 -> total notes
        */


    @Cron('0 0 * * * *')
    private async dayDrop() {
      const now = new Date().getTime();
      const user = await this.us.get('oos');
      const d = utcToZonedTime(now,user.settings.sys_timezone);
      if (d.getHours() == 0) {
        const tag = await this.ts.get("SYS_TYPE");
        this.upsert(new Drop({
          _id: randomUUID(),
          type: "SYS",
          title: format(d,"eeee dd MMMM"),
          text: format(d,"eeee dd MMMM"),
          content: { },
          tags: [ tag ],
          date: now,
          recurrence: 'none'
        }))
      }
    }

    // s m h d m wd
    @Cron('0 * * * * *') // minute
    private async recurrence() {
      const now = Date.now();
      const before = subMinutes(now,1).getTime();

      const drops = this.realm.objects<Drop>('Drop').filtered('date < $0 AND date >= $1 AND recurrence != "none"', now, before);

      for (let d of drops) {
        this.realm.write(() => {
          const drop = new Drop(d.toJSON());
          drop.date =  d.recurrence === 'day' ? addDays(d.date,1).getTime() :
                      d.recurrence === 'week' ? addWeeks(d.date,1).getTime() :
                      d.recurrence === 'month' ? addMonths(d.date,1).getTime() :
                      d.recurrence === 'year' ? addYears(d.date,1).getTime() :
                      d.recurrence === 'weekdays' ? addBusinessDays(d.date,1).getTime() :
                      d.date;
          drop._id = randomUUID();
          drop.text = (d.clone ? d.text : "")
          
          if (d.type === 'RATE') drop.content.value = 0;
          if (d.type === 'TASK') drop.content.completed = false;
          if (d.type === 'GOAL') drop.content.createdAt = Date.now();
          this.upsert(drop);
        })
      };
    }
}
