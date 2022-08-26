import { Stream } from 'src/app/model/stream';
import { IDrop, IStream } from '../../model/oos-types';

export class DropText implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { text: string } = { text: "" }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropText>) {
        Object.assign(this, init);
    }    
}
