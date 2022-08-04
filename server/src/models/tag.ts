export class Tag {
    id: string = "";
    name: string = "";
    color: string = "";
    icon: string = "";
    count: number = 0;
    uid: string = "";
    
    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}