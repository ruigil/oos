
export class User {
    id: string = "";
    username: string = "";
    settings: { transaction: { currency: string }, home: { preview: string }, system: { day: boolean } } = 
                { transaction: { currency: "CHF"}, home: { preview: 'day'}, system: { day: true } } 
    
    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}