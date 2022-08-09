
export class User {
    id: string = "";
    username: string = "";
    settings: { 
        transaction: { currency: string }, 
        home: { preview: string }, 
        system: { day: boolean, timezone: string } } = 
        { transaction: { currency: "CHF"}, home: { preview: 'day'}, system: { day: true, timezone: "Europe/Zurich" } } 
    
    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}