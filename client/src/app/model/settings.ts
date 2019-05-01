export class Settings {
    id: string;
    transaction: { currency: string };
    home: { preview: string, timezone: number };
    
    public constructor(init?:Partial<Settings>) {
        Object.assign(this, init);
    }
}