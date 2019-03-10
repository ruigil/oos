export class Drop {
    id: string;
    text: string;
    transaction?: { value: number, type: string, recurrence: string };
    tags: Array<string>;
    date: string;
    updatedAt: any;
    createdAt: any;
}