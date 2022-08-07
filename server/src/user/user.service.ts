import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private urepo: Repository<UserEntity>,
    ) {
        this.urepo.findOneBy( { id: "oos" }).then( user => {
            if (user == null) {
                console.log("insert user")
                this.urepo.save(new UserEntity({
                    id: "oos",
                    username: "oos",
                    settings: { transaction: { currency: "CHF"}, home: { preview: 'day' }, system: { day: true} }
                }));
            } 
        });
    }

    create(user:User):Promise<UserEntity> {
        return this.urepo.save(new UserEntity( {...user}));
    }

    update(user:User): Promise<UserEntity> {
        return this.urepo.save(new UserEntity( {...user }));
    }

    get(id:string):Promise<UserEntity> {
        return this.urepo.findOneBy({ id:id })
    }

    delete(id:string):Promise<DeleteResult> {
        return this.urepo.delete(id);
    }

    findAll():Promise<UserEntity[]> {
        console.log("find users")
        return this.urepo.find();
    }
}