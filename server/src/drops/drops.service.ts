import { Injectable } from '@nestjs/common';
import { Drop } from 'src/models/drop';
import { subHours, endOfYear } from 'date-fns';
import { TagsService } from 'src/tags/tags.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DropEntity } from './drop.entity';
import { DeleteResult, Repository } from 'typeorm';
import { Tag } from 'src/models/tag';
import { TagEntity } from 'src/tags/tag.entity';


@Injectable()
export class DropsService {
    drops: Drop[] = [];

    constructor(
      @InjectRepository(DropEntity) private drepo: Repository<DropEntity>,
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
      return this.drepo.save(new DropEntity( {...drop, tags:tags }));
    }

    async update(drop:Drop): Promise<DropEntity> {
      //const tags:TagEntity[] = await this.ts.findByIds( drop.tags.map( t=> t.id));
      const tags:TagEntity[] = drop.tags.map( t => new TagEntity({...t}) );
      return this.drepo.save(new DropEntity( {...drop, tags:tags }));
    }

    get(id:string):Promise<DropEntity> {
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

    private generateID(): string {
        return Date.now().toString(36).concat(Math.random().toString(36).substring(2,8));
    }

    private generateDrops():void {
      /*
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
  
        let dd = {
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
          date: subHours(endOfYear(Date.now()), i*12 ),
          deleted: false,
          ...d
        };
        let drop = new Drop(dd);
        this.drops.push(drop);
      }
      */        
    }
}
