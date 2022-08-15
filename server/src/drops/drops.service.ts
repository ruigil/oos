import { Injectable } from '@nestjs/common';
import { Drop } from 'src/models/drop';
import { subHours, endOfYear, addMinutes, addDays, addWeeks, addMonths, addYears, addBusinessDays, parseISO, isWithinInterval, parse } from 'date-fns';
import { TagsService } from 'src/tags/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DropEntity } from './drop.entity';
import { DeleteResult, Repository } from 'typeorm';
import { TagEntity } from 'src/tags/tag.entity';
import { Cron } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';
import { UserEntity } from 'src/user/user.entity';
import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz';


@Injectable()
export class DropsService {
    drops: Drop[] = [];

    constructor(
      @InjectRepository(DropEntity) private drepo: Repository<DropEntity>,
      @InjectRepository(TagEntity) private trepo:Repository<TagEntity>,
      @InjectRepository(UserEntity) private urepo:Repository<UserEntity>,
      private ts: TagsService) {
    }

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
            dtype === 'NOTE' ? [ this.ts.get("NOTE_TYPE"), this.ts.get("HELLO") ] :
            dtype === 'RATE' ? [ this.ts.get("RATE_TYPE"), this.ts.get("BYE") ] :
            dtype === 'TASK' ? [ this.ts.get("TASK_TYPE"), this.ts.get("HELLO") ] :
            dtype === 'GOAL' ? [ this.ts.get("GOAL_TYPE"), this.ts.get("BYE") ] :
            dtype === 'MONEY' ? [ this.ts.get("MONEY_TYPE"), this.ts.get("HELLO") ] : []
          ,
          date: subHours(endOfYear(Date.now()), i*12 ).getTime(),
          ...d
        };
        drops.push(new Drop(dd));
      }
      
      const r = await Promise.all( drops.map( d => this.create(d)) );

      return Promise.resolve({result: r.length === 1000}); 
    }

    async create(drop:Drop):Promise<DropEntity> {
 

      //const tags:TagEntity[] = await this.ts.findByIds( drop.tags.map( t=> t.id));

      const tags:TagEntity[] = drop.tags.map( t => new TagEntity({...t}) );
      const dropEnt = await this.drepo.save(new DropEntity( {...drop, tags:tags }));
      this.updateGoals(drop);
      return Promise.resolve(dropEnt);
    }

    async update(drop:Drop): Promise<DropEntity> {
      //const tags:TagEntity[] = await this.ts.findByIds( drop.tags.map( t=> t.id));
      const tags:TagEntity[] = drop.tags.map( t => new TagEntity({...t}) );
      const dropEnt = await this.drepo.save(new DropEntity( {...drop, tags:tags }));
      this.updateGoals(drop);
      return Promise.resolve(dropEnt);
    }

    get(id:string):Promise<DropEntity> {
      this.updateGoals(new Drop());
      return this.drepo.findOne({ 
        where: {
          id:id
        },
        relations: {
          tags: true
        } 
      })
    }

    async delete(id:string):Promise<DeleteResult> {
      const drop = await this.get(id);
      await this.drepo.save({...drop, tags:[]});
      return this.drepo.delete(id);
    }

    findAll():Promise<DropEntity[]> {
      return this.drepo.find( {
        relations: {
          tags: true
        }
      });
      
    }

    private async updateGoals(drop:Drop) {
      const now = Date.now();
      const ddate = drop.date;

      const out = (d:DropEntity) => {
        console.log(`drop [${d.type}] [${d.title}]`)
        if (d.tags) console.log(`tags [${ d.tags.map(t => t.id+',' ) }]`)
        if (d.goal?.tags) console.log(`tags [${ d.goal.tags.map(t => t.id+',' ) }]`)
      }
      
      const goals:DropEntity[] = await this.drepo.createQueryBuilder("drop")
      .where("drop.date >= :now", { now })
      .andWhere("drop.type = :type", { type: "GOAL" })
      .getMany();

      //console.log("goals")
      //goals.forEach( g => out(g) );

      for (let g of goals) {
        const goalDate = g.date;
        const goalCreated:number = new Date(g.createdAt.toString()).getTime();
        const goalTags = g.goal.tags.map( t => t.id);
        const drops = await this.drepo.createQueryBuilder("drop")
        .leftJoinAndSelect("drop.tags","tag")
        .where("drop.type <> 'GOAL'")
        .andWhere("drop.date >= :goalCreated", { goalCreated })
        .andWhere("drop.date < :goalDate", { goalDate })
        .andWhere("tag.id IN(:...ids)", { ids: goalTags })
        .getMany()
        
        const totals = new Map( goalTags.map( t => [ t, [0,0,0,0,0,0,0] ]) )

        //console.log("drops")
        //drops.forEach(d => out(d));

        const countTotalType = (drop:DropEntity, tag:TagEntity) => {
          const tot = totals.get(tag.id);
          switch(drop.type) {
            case "NOTE" : tot[6]++; break;
            case "RATE" : tot[4]++; tot[5] += drop.rate.value; break;
            case "MONEY" : drop.money.type == 'expense' ? tot[2] += drop.money.value : tot[3] += drop.money.value; break;
            case "TASK" : tot[0]++; tot[1] += drop.task.completed ? 1 : 0; break;
          }
          totals.set(tag.id,tot);
        }

        drops.forEach( d=> d.tags.forEach( t => countTotalType(d,t) ) )

        g.goal.tags = [...totals.entries()].map( e => ({ id: e[0], totals: e[1]}))
        //console.log(g.goal.tags);
        this.drepo.save(g);
      }
    }

    private generateID(): string {
        return Date.now().toString(36).concat(Math.random().toString(36).substring(2,8));
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
      const user = await this.urepo.findOneBy({ id: 'oos'});
      const d = utcToZonedTime(now,user.settings.system.timezone);
      if (d.getHours() == 0) {
        const tag = await this.ts.get("SYS_TYPE");
        await this.drepo.save(new DropEntity({
          id: this.generateID(),
          type: "SYS",
          title: format(d,"eeee dd MMMM"),
          system: { content: format(d,"eeee dd MMMM")},
          tags: [ tag ],
          date: now,
          recurrence: 'none'
        }));  
      }
    }

    // s m h d m wd
    @Cron('0 * * * * *') // minute
    private async recurrence() {
      const now = Date.now();
      const before = subMinutes(now,1).getTime();

      const tagsRel = await this.drepo.createQueryBuilder("drop").relation(DropEntity,"tags");
      
      const drops:DropEntity[] = await this.drepo.createQueryBuilder("drop")
      .where("drop.date < :now", { now })
      .andWhere("drop.date >= :before", { before })
      .andWhere("drop.recurrence != 'none'").getMany();

      //console.log(`drops found ${drops.length}`)

      for (let d of drops) {
        const ts = await tagsRel.of(d).loadMany();
        d.date =  d.recurrence === 'day' ? addDays(d.date,1).getTime() :
                  d.recurrence === 'week' ? addWeeks(d.date,1).getTime() :
                  d.recurrence === 'month' ? addMonths(d.date,1).getTime() :
                  d.recurrence === 'year' ? addYears(d.date,1).getTime() :
                  d.recurrence === 'weekdays' ? addBusinessDays(d.date,1).getTime() :
                  d.date;
        d.id = this.generateID();
        
        if (d.type === 'RATE') d.rate.value = 0;
        if (d.type === 'TASK') d.task.completed = false;

        const nd = await this.drepo.save( new DropEntity( {...d, content: (d.clone ? d.content : "") }));
        ts.forEach( t => tagsRel.of(nd.id).add(t.id) );
      }
    }
}
