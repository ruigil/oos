import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Drop } from '../models/drop';
import { DropsService } from './drops.service';

@Controller('drops')
export class DropsController {

    constructor(private ds: DropsService) {}

    @Post()
    async create(@Body() createDrop: Drop) {
        return this.ds.create(createDrop);
    }

    @Get()
    async findAll(@Query() query: string) {
        return this.ds.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.ds.get(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDrop: Drop) {
        return this.ds.update(id, updateDrop);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.ds.delete(id);
    }
}
