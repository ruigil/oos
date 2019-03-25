export class Settings {
    id: string;
    transaction: { currency: string }
    
    public constructor(init?:Partial<Settings>) {
        Object.assign(this, init);
    }    
}