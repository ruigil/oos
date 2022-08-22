export class Tag {
    _id: string = "";
    name: string = "";
    description: string = "";
    type: string = "";
    uid: string = "";
    selected?: boolean = false;
    filtered?: boolean = false;
    available?: boolean = true;
    icon: string = "";
    color: string = "";

    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}