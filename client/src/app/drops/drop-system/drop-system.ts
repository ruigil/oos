import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropSystem implements IDrop {
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
    
    public constructor(init?:Partial<DropSystem>) {
        Object.assign(this, init);
    }    
}
