export class Tag {
    id: string = "";
    name: string = "";
    color: string = "";
    icon: string = "";
    count: number = 0;
    selected?: boolean = false;
    filtered?: boolean = false;
    available?: boolean = true;
    uid: string = "";
    createdAt: any;
    updatedAt: any;

    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}