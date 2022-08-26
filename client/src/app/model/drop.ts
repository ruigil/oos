import { Stream } from './stream';

type text = {  text: string }
type image = { description: string, filename: string, mimetype:string, originalname:string }; 
type money = { description: string, value: number, type: string, currency: string };
type task = { description: string, date: any, completed: boolean };
type system = { text: string }
type rate = { description:string, value: number }
type goal = { description: string, completed: boolean, streams: Array<{id: string, totals: Array<number>}> };

export class Drop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content?: any;//note | photo | money | task | system | rate | goal;
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}
