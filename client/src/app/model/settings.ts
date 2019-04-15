export class Settings {
    id: string;
    transaction: { currency: string };
    home: { preview: string };
    
    public constructor(init?:Partial<Settings>) {
        Object.assign(this, init);
    }
}