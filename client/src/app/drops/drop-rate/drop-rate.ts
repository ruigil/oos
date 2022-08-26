import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropRate implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { description:string, value: number } = { description: "", value: 0 }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropRate>) {
        Object.assign(this, init);
    }    
}
