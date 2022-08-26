import { Stream } from './stream'

type note = { text: string }
type photo = { description:string, filename: string, mimetype:string, originalname:string }; 
type money = { description:string, value: number, type: string, currency: string };
type task = { description:string, date: any, completed: boolean };
type system = { text: string }
type rate = { description: string, value: number }
type goal = { text: string, completed: boolean, tags: Array<{id: string, totals: Array<number>}> };

export class Drop {
    _id: string = "";
    name: string = "";
    type: string = "";
    uid: string = "";
    date: number = 0;
    content: any; //note | photo | money | task | system | rate | goal;
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}