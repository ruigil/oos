type PublicStream = { description: string, skin: string }

export class Stream {
    _id: string = ""; // name@type
    type: string = ""; // personal, public, people, apps
    name: string = "";
    content: any; // publicstream
    uid: string = "";
    
    public constructor(init?:Partial<Stream>) {
        Object.assign(this, init);
    }    

}