import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Tag } from '../models/tag';

import { TagsService } from './tags.service';

@Controller('api/tags')
export class TagsController {

    constructor(private ts: TagsService) {}

    @Post()
    async create(@Body() tag: Tag):Promise<Tag> {
        return this.ts.upsert(tag);
    }

    @Get()
    async findAll():Promise<Tag[]> {
        return this.ts.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<Tag> {
        return this.ts.get(id);
    }

    @Put(':id')
    async update(@Body() tag: Tag):Promise<Tag> {
        return this.ts.upsert(tag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<boolean> {
        return this.ts.delete(id);
    }
}
