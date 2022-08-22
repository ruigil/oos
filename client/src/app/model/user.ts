
export class User {
    id: string = "";
    username: string = "";
    bio: string = "";
    avatar: string = "";
    settings: { 
        currency: string , 
        preview: string , 
        sys_day: boolean, 
        sys_timezone: string  
    } = 
    { 
        currency: "CHF", 
        preview: 'day', 
        sys_day: true, 
        sys_timezone: "Europe/Zurich"  
    } 
    
    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }
}