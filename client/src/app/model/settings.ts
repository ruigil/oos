export class Settings {
    transaction: { currency: string };
    home: { preview: string, timezone: number };
    system: { day: boolean, analytics: boolean };
    uid: string;
    
    public constructor(init?:Partial<Settings>) {
        Object.assign(this, init);
    }
}