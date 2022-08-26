import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropTask implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { description: string, date: any, completed: boolean } = { description: "", date: 0, completed: false }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropTask>) {
        Object.assign(this, init);
    }    
}
