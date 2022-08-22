import { Tag } from './tag';

type note = {  }
type photo = { filename: string, mimetype:string, originalname:string }; 
type money = { value: number, type: string, currency: string };
type task = { date: any, completed: boolean };
type system = {  }
type rate = { value: number }
export type goal = { completed: boolean, tags: Array<{id: string, totals: Array<number>}> };

export class Drop {
    _id: string = "";
    type: string = "";
    title: string = "";
    text: string = "";
    content?: any;//note | photo | money | task | system | rate | goal;
    recurrence: string = "";
    clone: boolean = false;
    tags: Array<Tag> = [];
    date: number = 0;
    uid: string = "";
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}
