export class Drop {
    id: string;
    text: string;
    transaction?: { value: number, type: string, recurrence: string };
    task?: { startdate: any, enddate: any, recurrence: string };
    tags: Array<string>;
    date: any;
    updatedAt: any;
    createdAt: any;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}