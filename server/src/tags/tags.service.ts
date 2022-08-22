import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DropSchema, TagSchema, UserSchema } from 'src/models/schema';
import { Tag } from '../models/tag';
import * as Realm from "realm";

const TAGS = [
    new Tag({ _id:"NOTE_TYPE", name:"NOTE", type: "NOTE" }),
    new Tag({ _id:"RATE_TYPE", name:"RATE", type: "RATE" }),
    new Tag({ _id:"TASK_TYPE", name:"TASK", type: "TASK" }),
    new Tag({ _id:"GOAL_TYPE", name:"GOAL", type: "GOAL" }),
    new Tag({ _id:"MONEY_TYPE", name:"MONEY", type: "MONEY" }),
    new Tag({ _id:"SYS_TYPE", name:"SYSTEM", type: "SYS" }),
    new Tag({ _id:"PHOTO_TYPE", name:"PHOTO", type: "PHOTO" }),
    new Tag({ _id:"OOS_STREAM", name:"OOS", description: "Default user stream", type: "STREAM", uid: "oos"}),
]

@Injectable()
export class TagsService implements OnModuleInit, OnModuleDestroy {
    realm:Realm;

    constructor() {
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
        
        TAGS.forEach( t => this.upsert(t) );
    }


    upsert(tag:Tag): Promise<Tag> {    
        return new Promise<Tag>((resolve,reject) =>{
            this.realm.write(() => {          
                try {
                    const t = this.realm.create<Tag>('Tag', {...tag}, Realm.UpdateMode.Modified);
                    resolve(new Tag(t.toJSON()));
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    get(id:string):Promise<Tag> {
        return new Promise<Tag>((resolve,reject) => {
            try {
                const t = this.realm.objectForPrimaryKey<Tag>('Tag', id);
                resolve(new Tag(t.toJSON()));
            } catch(e) {
                reject(e);
            }
        });
    }

    delete(id:string):Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            this.realm.write(() => {
                try {
                    const t = this.realm.objectForPrimaryKey<Tag>('Tag', id);
                    this.realm.delete(t);
                    resolve(true);
                } catch(e) {
                    reject(false);
                }
            });
        });
    }

    findAll():Promise<Tag[]> {    
        return new Promise<Tag[]>((resolve,reject) => {
            try {
                const tags = this.realm.objects<Tag>('Tag');
                resolve(tags.map( t => new Tag(t.toJSON())));
            } catch(e) {
                reject(e);
            }
        });
    }

}