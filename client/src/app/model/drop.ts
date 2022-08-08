import { Tag } from './tag';

export class Drop {
    id: string = "";
    type: string = "";
    title: string = "";
    note?: { content: string };
    money?: { value: number, type: string, currency: string };
    task?: { description: string, date: any, completed: boolean };
    system?: { content: string };
    rate?: { description: string, value: number };
    goal?: { content: string, completed: boolean, tags: Array<{ id: string, totals: Array<number> }> };
    recurrence: string = "";
    tags: Array<Tag> = [];
    date: number = 0;
    uid: string = "";
    color?: string = "";
    filtered?: boolean = false;
    available?: boolean = true;
    updatedAt: any;
    createdAt: any;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}