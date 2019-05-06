export class User {
    uid: string;
    email: string;
    displayName?: string;
    
    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}