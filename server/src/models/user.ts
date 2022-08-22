export class User {
    id: string = "";
    username: string = "";
    bio: string = "";
    avatar: string = "";
    location: string = "";
    settings: {
        transaction: { currency: string  };
        home: { preview: string };
        system: { day: boolean, timezone: string };        
    }
}
