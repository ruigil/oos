export class Drop {
    id: string;
    type: string;
    text: string;
    transaction?: { value: number, type: string, currency: string };
    task?: { title: string, date: any, completed: boolean };
    analytics?: { month: number, year: number, totals: Array<number>, tags: Array<{ tag: string, totals: Array<number> }> };
    rate?: { text: string, value: number };
    recurrence: string;
    tags: Array<string>;
    date: any;
    updatedAt: any;
    createdAt: any;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}