import { IStream } from './oos-types'

type publicStream = { description: string, skin: string }

export class Stream implements IStream {
    _id: string = "";
    name: string = "";
    type: string = "PERSONAL";
    content?: any; 
    uid: string = "";
    selected?: boolean = false;
    filtered?: boolean = false;
    available?: boolean = true;
    icon: string = "bookmark";
    color: string = "dark";

    public constructor(init?:Partial<Stream>) {
        Object.assign(this, init);
    }    

}