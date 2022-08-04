import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>, private jwt: JwtService) { 

    }

    async validateUser(useraddress: string, password: string): Promise<any> {
        const foundUser = await this.userRepository.findOne({
            where: { id: useraddress }
        });
        if (foundUser) {
            /*
            if (await bcrypt.compare(password, foundUser.password)) {
                const { password, ...result } = foundUser
                return result;
            }
 
            return null;
            */
        }
        return null
 
    }    
    
    async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role };
 
        return { access_token: this.jwt.sign(payload) };
    }
}