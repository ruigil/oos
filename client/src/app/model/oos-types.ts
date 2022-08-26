import { Stream } from "./stream";

export interface HomeStream {
    startAt: number;
    preview: string;
}
type text = {  text: string }
type image = { description: string, filename: string, mimetype:string, originalname:string }; 
type money = { description: string, value: number, type: string, currency: string };
type task = { description: string, date: any, completed: boolean };
type system = { text: string }
type rate = { description:string, value: number }
type goal = { description: string, completed: boolean, streams: Array<{id: string, totals: Array<number>}> };

export interface IDrop {
    _id: string;
    type: string;
    name: string;
    date: number;
    uid: string;
    content: text | image | system | task | money | rate | goal;
    recurrence: string;
    clone: boolean;
    streams: Array<Stream>;
}

export interface IStream {
    _id: string;
    name: string;
    type: string;
    content?: object;
    uid: string;
}