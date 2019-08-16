export class Drop {
    id: string;
    type: string;
    text: string;
    transaction?: { value: number, type: string, currency: string };
    task?: { title: string, date: any, completed: boolean };
    analytics?: { month: number, year: number, totals: Array<number>, tags: {} };
    rate?: { text: string, value: number };
    goal?: { completed: boolean, totals: Array<number>, tags: {} };
    recurrence: string;
    tags: Array<string>;
    date: any;
    updatedAt: any;
    createdAt: any;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}