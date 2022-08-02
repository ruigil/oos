import { Preview } from './stream';

export class Settings {
    transaction: { currency: string  } = { currency : "CHF" };
    home: { preview: Preview } = { preview: 'day' };
    system: { day: boolean } = { day: true };
    uid: string = "";
    
    public constructor(init?:Partial<Settings>) {
        Object.assign(this, init);
    }

}