import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropMoney implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { description: string, value: number, type: string, currency: string } = { description: "", value: 0, type: "expense", currency: "" }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropMoney>) {
        Object.assign(this, init);
    }
}
