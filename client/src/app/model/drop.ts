import { IDrop, IStream } from './oos-types';
import { Stream } from './stream';


export class Drop implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: any;//note | photo | money | task | system | rate | goal;
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<Drop>) {
        Object.assign(this, init);
    }    
}
