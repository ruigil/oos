import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        MulterModule.register({
            dest: '/oos/db/upload'
        }),         
    ],
    providers: [UsersService],
    controllers: [UsersController],
       
    exports: [UsersService]
})
export class UsersModule {}
