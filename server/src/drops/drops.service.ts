import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  addDays,
  addWeeks,
  addMonths,
  addYears,
  addBusinessDays,
} from 'date-fns';
import { Cron } from '@nestjs/schedule';
import { subMinutes } from 'date-fns';
import { randomUUID } from 'crypto';

import { utcToZonedTime, zonedTimeToUtc, format } from 'date-fns-tz';
import { DropSchema, StreamSchema, UserSchema } from 'src/models/schema';
import { StreamsService } from 'src/streams/streams.service';
import { UsersService } from 'src/users/users.service';
import { Drop } from 'src/models/drop';

import * as Realm from 'realm';

@Injectable()
export class DropsService implements OnModuleInit, OnModuleDestroy {
  realm: Realm;

  drops: Drop[] = [];

  constructor(private ts: StreamsService, private us: UsersService) {}

  onModuleDestroy() {
    this.realm.close();
  }

  async onModuleInit() {
    this.realm = await Realm.open({
      path: '/oos/db/oos.realm',
      schema: [DropSchema, StreamSchema, UserSchema],
      schemaVersion: 2,
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

  upsert(drop: Drop): Promise<Drop> {
    return new Promise<Drop>((resolve, reject) => {
      this.realm.write(() => {
        try {
          const streams = drop.streams.map((t) =>
            this.realm.create('Stream', t, Realm.UpdateMode.Modified),
          );
          if (drop.type === 'GOAL_TYPE') {
            const d = this.realm.create<Drop>(
              'Drop',
              {
                ...drop,
                content: {
                  text: drop.content.text,
                  completed: drop.content.completed,
                  createdAt: Date.now(),
                  streams: JSON.stringify(drop.content.streams),
                },
                streams: streams,
              },
              Realm.UpdateMode.Modified,
            );

            const nd = d.toJSON();
            nd.content.streams = JSON.parse(nd.content.streams);
            resolve(nd);
          } else {
            const d = this.realm.create<Drop>(
              'Drop',
              {
                ...drop,
                streams: streams,
              },
              Realm.UpdateMode.Modified,
            );

            this.updateGoals();
            resolve(d.toJSON());
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  get(id: string): Promise<Drop> {
    return new Promise<Drop>((resolve, reject) => {
      try {
        const d = this.realm.objectForPrimaryKey<Drop>('Drop', id);
        const nd = d.toJSON();
        if (d.type === 'GOAL_TYPE') {
          nd.content.streams = JSON.parse(nd.content.streams);
        }
        resolve(nd);
      } catch (e) {
        reject(e);
      }
    });
  }

  delete(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.realm.write(() => {
        try {
          const d = this.realm.objectForPrimaryKey<Drop>('Drop', id);
          this.realm.delete(d);
          resolve(true);
        } catch (e) {
          reject(false);
        }
      });
    });
  }

  async findAll(): Promise<Drop[]> {
    return new Promise<Drop[]>((resolve, reject) => {
      try {
        const drops = this.realm.objects<Drop>('Drop');
        resolve(
          drops.map((d) => {
            const nd = d.toJSON();
            if (d.type === 'GOAL_TYPE') {
              nd.content.streams = JSON.parse(nd.content.streams);
            }
            return new Drop(nd);
          }),
        );
      } catch (e) {
        reject(e);
      }
    });
  }

  private async updateGoals() {
    const now = Date.now();

    const out = (d: Drop) => {
      console.log(`drop [${d.type}] [${d.name}]`);
      if (d.streams)
        console.log(`streams [${d.streams.map((s) => s._id + ',')}]`);
      if (d.content?.streams)
        console.log(
          `goal streams [${JSON.parse(d.content.streams).map(
            (s) => s.id + ',',
          )}]`,
        );
    };

    const goals = this.realm
      .objects<Drop>('Drop')
      .filtered('date >= $0 AND type = "GOAL"', now);

    //console.log("goals")
    //goals.forEach( g => out(g) );

    for (let g of goals) {
      const goal = new Drop(g.toJSON());
      goal.content.streams = JSON.parse(goal.content.streams);
      const goalDate = goal.date;
      const goalCreated: number = goal.content.createdAt;
      const goalStreams = goal.content.streams.map((s) => s.id);

      const streamsQuery = goalStreams.reduce(
        (acc, v, i) => acc + `${i == 0 ? '' : 'OR'} tags.name == "${v}" `,
        '',
      );
      const drops = this.realm
        .objects<Drop>('Drop')
        .filtered(
          `type <> "GOAL" AND date >= ${goalCreated} AND date < ${goalDate} AND (${streamsQuery})`,
        );

      const totals = new Map(
        goalStreams.map((t) => [t, [0, 0, 0, 0, 0, 0, 0, 0]]),
      );

      //console.log("drops")
      //drops.forEach(d => out(d));

      drops
        .map((drop) => drop.toJSON())
        .forEach((drop) =>
          drop.streams.forEach((stream) => {
            // count total type
            const tot = totals.get(stream._id);
            if (tot) {
              switch (drop.type) {
                case 'PHOTO':
                  tot[7]++;
                  break;
                case 'NOTE':
                  tot[6]++;
                  break;
                case 'RATE':
                  tot[4]++;
                  tot[5] += drop.content.value;
                  break;
                case 'MONEY':
                  drop.content.type == 'expense'
                    ? (tot[2] += drop.content.value)
                    : (tot[3] += drop.content.value);
                  break;
                case 'TASK':
                  tot[0]++;
                  tot[1] += drop.content.completed ? 1 : 0;
                  break;
              }
              totals.set(stream._id, tot);
            }
          }),
        );

      goal.content.streams = [...totals.entries()].map((e) => ({
        id: e[0],
        totals: e[1],
      }));
      //console.log(goal.content.streams)
      const d = this.realm.create<Drop>(
        'Drop',
        {
          ...goal,
          content: {
            text: goal.content.text,
            completed: goal.content.completed,
            createdAt: goal.content.createdAt,
            streams: JSON.stringify(goal.content.streams),
          },
        },
        Realm.UpdateMode.Modified,
      );
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

  // TODO: Rethink this as a voluntary subscription that the user make to a service.
  @Cron('0 0 * * * *')
  private async dayDrop() {
    const now = new Date().getTime();
    const user = await this.us.get('oos');
    const d = utcToZonedTime(now, user.settings.sys_timezone);
    if (d.getHours() == 0) {
      const stream = await this.ts.get('SYS_TYPE');
      this.upsert(
        new Drop({
          _id: randomUUID(),
          type: 'SYS',
          name: format(d, 'eeee dd MMMM'),
          content: { text: format(d, 'eeee dd MMMM') },
          streams: [stream],
          date: now,
          recurrence: 'none',
        }),
      );
    }
  }

  // s m h d m wd
  @Cron('0 * * * * *') // minute
  private async recurrence() {
    const now = Date.now();
    const before = subMinutes(now, 1).getTime();

    const drops = this.realm
      .objects<Drop>('Drop')
      .filtered(
        'date < $0 AND date >= $1 AND recurrence != "none"',
        now,
        before,
      );

    for (let d of drops) {
      this.realm.write(() => {
        const drop = new Drop(d.toJSON());
        drop.date =
          d.recurrence === 'day'
            ? addDays(d.date, 1).getTime()
            : d.recurrence === 'week'
            ? addWeeks(d.date, 1).getTime()
            : d.recurrence === 'month'
            ? addMonths(d.date, 1).getTime()
            : d.recurrence === 'year'
            ? addYears(d.date, 1).getTime()
            : d.recurrence === 'weekdays'
            ? addBusinessDays(d.date, 1).getTime()
            : d.date;
        drop._id = randomUUID();

        const reset = (type: string) => {
          // TODO: Probably content types, should be aligned with mimetypes.
          switch (type) {
            case 'TEXT':
              return { text: '' };
            case 'IMAGE':
              return {
                description: '',
                filename: '',
                mimetype: '',
                originalname: '',
              };
            case 'MONEY':
              return {
                description: '',
                value: 0,
                type: 'expense',
                currency: '',
              };
            case 'TASK':
              return { description: '', date: 0, completed: false };
            case 'RATE':
              return { description: '', value: 0 };
            case 'GOAL':
              return {
                text: '',
                completed: false,
                createdAt: Date.now(),
                streams: JSON.stringify(
                  JSON.parse(drop.content.streams).map((s) => ({
                    id: s.id,
                    totals: [0, 0, 0, 0, 0, 0, 0, 0],
                  })),
                ),
              };
          }
          return {};
        };

        drop.content = d.clone ? d.content : reset(drop.type);

        this.upsert(drop);
      });
    }
  }
}
