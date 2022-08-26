import { Stream } from 'src/app/model/stream';
import { IDrop } from '../../model/oos-types';

export class DropImage implements IDrop {
    _id: string = "";
    type: string = "";
    name: string = "";
    date: number = 0;
    uid: string = "";
    content: { description: string, filename: string, mimetype: string, originalname: string } 
        = { description: "", filename: "", mimetype: "", originalname: "" }
    recurrence: string = "";
    clone: boolean = false;
    streams: Array<Stream> = [];
    color?: string = "";
    available?: boolean = true;
    
    public constructor(init?:Partial<DropImage>) {
        Object.assign(this, init);
    }
}
