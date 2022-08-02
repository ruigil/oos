import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Tag } from '../models/tag';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {

    constructor(private ts: TagsService) {}

    @Post()
    async create(@Body() createDrop: Tag) {
        return this.ts.create(createDrop);
    }

    @Get()
    async findAll(@Query() query: string) {
        return this.ts.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ts.get(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTag: Tag) {
        return this.ts.update(id, updateTag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.ts.delete(id);
    }
}
