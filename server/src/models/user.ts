export class User {
    id: string = "";
    username: string = "";
    settings: {
        transaction: { currency: string  };
        home: { preview: string };
        system: { day: boolean };        
    }
}
