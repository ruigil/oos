import { Body, Controller, Delete, Get, Param, Post, Put, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Drop } from 'src/models/drop';
import { User } from 'src/models/user';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {

    constructor(private us: UsersService) {
        
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

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      // pass the user to the path, for isolation of user files
      //console.log(file);
      return file;
    }  
  
    @Get('file/:filename')
    getFile(@Param('filename') filename: string): StreamableFile {
      const file = createReadStream(join("/oos/db/upload", filename));
      return new StreamableFile(file);
    }
    
    @Post('stream')
    async stream(@Body() streams: { uid: string, streams: string[] }):Promise<Drop[]> {
        return this.us.findByTags(streams.uid, streams.streams);
    }  
}
