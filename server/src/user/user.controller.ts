import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/models/user';
import { UserService } from './user.service';

@Controller('api/user')
export class UserController {

    constructor(private us: UserService) {
        
    }

    @Post()
    async create(@Body() user: User):Promise<User> {
        return this.us.upsert(user);
    }

    @Get()
    async findAll():Promise<User[]> {
        return this.us.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<User> {
        return this.us.get(id);
    }

    @Put(':id')
    async update(@Body() user: User):Promise<User> {
        return this.us.upsert(user);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<boolean> {
        return this.us.delete(id);
    }
}
