import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Tag } from '../models/tag';
import { TagEntity } from './tag.entity';
import { TagsService } from './tags.service';

@Controller('api/tags')
export class TagsController {

    constructor(private ts: TagsService) {}

    @Post()
    async create(@Body() tag: Tag):Promise<TagEntity> {
        return this.ts.create(tag);
    }

    @Get()
    async findAll():Promise<TagEntity[]> {
        return this.ts.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<TagEntity> {
        return this.ts.get(id);
    }

    @Put(':id')
    async update(@Body() tag: Tag):Promise<TagEntity> {
        return this.ts.update(tag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<DeleteResult> {
        return this.ts.delete(id);
    }
}
