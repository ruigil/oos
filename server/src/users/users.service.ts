import { Injectable} from '@nestjs/common';
import { User } from 'src/models/user';
import * as Realm from "realm";
import { DropSchema, StreamSchema, UserSchema } from 'src/models/schema';
import { Drop } from 'src/models/drop';

@Injectable()
export class UsersService {
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
        this.upsert(new User({
            _id: 'oos',
            username: 'OOS',
            bio: 'OOS is a system for managing your personal finances',
            avatar: 'https://avatars0.githubusercontent.com/u/17098281?s=460&v=4',
        }));
    }


    upsert(user:User): Promise<User> {    
        return new Promise<User>((resolve,reject) =>{
            this.realm.write(() => {          
                try {
                    const t = this.realm.create<User>('User', {...user}, Realm.UpdateMode.Modified);
                    resolve(new User(t.toJSON()));
                } catch(e) {
                    reject(e);
                }
            });
        });
    }

    get(id:string):Promise<User> {
        return new Promise<User>((resolve,reject) => {
            try {
                const t = this.realm.objectForPrimaryKey<User>('User', id);
                resolve(new User(t.toJSON()));
            } catch(e) {
                reject(e);
            }
        });
    }

    delete(id:string):Promise<boolean> {
        return new Promise<boolean>((resolve,reject) => {
            this.realm.write(() => {
                try {
                    const t = this.realm.objectForPrimaryKey<User>('User', id);
                    this.realm.delete(t);
                    resolve(true);
                } catch(e) {
                    reject(false);
                }
            });
        });
    }

    findAll():Promise<User[]> {    
        return new Promise<User[]>((resolve,reject) => {
            try {
                const tags = this.realm.objects<User>('Tag');
                resolve(tags.map( t => new User(t.toJSON())));
            } catch(e) {
                reject(e);
            }
        });
    }
    
    async findByTags(uid:string, streams:string[]):Promise<Drop[]> {
        console.log(uid,streams)
        const now = Date.now();
        const streamsQuery = streams.map( s => `streams._id == "${s}"`).join(' AND ');
        const drops = this.realm.objects<Drop>('Drop').filtered(`uid == '${uid}' AND date < ${now} AND (${streamsQuery})`).sorted('date', true);
        return Promise.resolve(drops.map( d => d.toJSON()));
    }

}