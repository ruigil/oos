export class Tag {
    id: string;
    name: string;
    color: string;
    count: number;
    uid: string;
    createdAt: any;
    updatedAt: any;

    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}