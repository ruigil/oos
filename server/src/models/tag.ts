export class Tag {
    _id: string = "";
    type: string = "";
    name: string = "";
    description: string = "";
    uid: string = "";
    
    public constructor(init?:Partial<Tag>) {
        Object.assign(this, init);
    }    

}