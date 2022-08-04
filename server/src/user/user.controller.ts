import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/models/user';
import { DeleteResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private us: UserService) {}

    @Post()
    async create(@Body() user: User):Promise<UserEntity> {
        return this.us.create(user);
    }

    @Get()
    async findAll():Promise<UserEntity[]> {
        return this.us.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<UserEntity> {
        return this.us.get(id);
    }

    @Put(':id')
    async update(@Body() user: User):Promise<UserEntity> {
        return this.us.update(user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<DeleteResult> {
        return this.us.delete(id);
    }
}
