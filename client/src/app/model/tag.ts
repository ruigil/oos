export class Tag {
    id: string;
    name: string;
    color: string;
    count: number;
    createdAt: any;
    updatedAt: any;

    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}