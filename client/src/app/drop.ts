export class Drop {
    id: string;
    type: string;
    text: string;
    transaction?: { value: number, type: string };
    task?: { title: string, date: any, completed: boolean };
    recurrence: string;
    tags: Array<string>;
    date: any;
    updatedAt: any;
    createdAt: any;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}