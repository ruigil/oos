import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DropSchema, StreamSchema, UserSchema } from 'src/models/schema';
import { Stream } from '../models/stream';
import * as Realm from "realm";

const STREAMS = [
    new Stream({ _id:"urn:oos:0x0:oos:stream:TEXT:TEXT_TYPE", name:"NOTE", type: "TEXT_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:RATE:RATE_TYPE", name:"RATE", type: "RATE_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:TASK:TASK_TYPE", name:"TASK", type: "TASK_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:GOAL:GOAL_TYPE", name:"GOAL", type: "GOAL_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:MONEY:MONEY_TYPE", name:"MONEY", type: "MONEY_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:SYSTEM:SYSTEM_TYPE", name:"SYSTEM", type: "SYSTEM_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:IMAGE:IMAGE_TYPE", name:"IMAGE", type: "IMAGE_TYPE" }),
    new Stream({ _id:"urn:oos:0x0:oos:stream:OOS:PUBLIC", name:"OOS", content: { description: "Default user stream", skin: "oos" }, type: "PUBLIC", uid: "oos"}),
]

@Injectable()
export class StreamsService implements OnModuleInit, OnModuleDestroy {
    realm:Realm;

    constructor() {
    }

    onModuleDestroy() {
        this.realm.close();
    }

    async onModuleInit() {
        this.realm = await Realm.open({
            path: '/oos/db/oos.realm',
            schema: [DropSchema, StreamSchema, UserSchema],
            schemaVersion: 2
        });
        
        STREAMS.forEach( t => this.upsert(t) );
    }


    upsert(stream:Stream): Promise<Stream> {    
        return new Promise<Stream>((resolve,reject) =>{
            this.realm.write(() => {          
                try {
                    const t = this.realm.create<Stream>('Stream', {...stream}, Realm.UpdateMode.Modified);
                    resolve(new Stream(t.toJSON()));
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    get(id:string):Promise<Stream> {
        console.log(id)
        return new Promise<Stream>((resolve,reject) => {
            try {
                const t = this.realm.objectForPrimaryKey<Stream>('Stream', id);
                resolve(new Stream(t.toJSON()));
            } catch(e) {
                reject(e);
            }
        });
    }

    delete(id:string):Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            this.realm.write(() => {
                try {
                    const t = this.realm.objectForPrimaryKey<Stream>('Stream', id);
                    this.realm.delete(t);
                    resolve(true);
                } catch(e) {
                    reject(false);
                }
            });
        });
    }

    findAll():Promise<Stream[]> {    
        return new Promise<Stream[]>((resolve,reject) => {
            try {
                const streams = this.realm.objects<Stream>('Stream');
                resolve(streams.map( s => new Stream(s.toJSON())));
            } catch(e) {
                reject(e);
            }
        });
    }

}