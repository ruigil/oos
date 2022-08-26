import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropGoal implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { description: string, completed: boolean, streams: Array<{id: string, totals: Array<number>}> }
        = { description: "", completed: false, streams: [] }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropGoal>) {
        Object.assign(this, init);
    }
}
