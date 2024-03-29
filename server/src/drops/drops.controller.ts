import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, StreamableFile, Header } from '@nestjs/common';
import { Drop } from '../models/drop';
import { DropsService } from './drops.service';

@Controller('api/drops')
export class DropsController {

    constructor(private ds: DropsService) {}

    @Get()
    async findAll(): Promise<Drop[]> {
        return this.ds.findAll();        
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<Drop> {
        return this.ds.get(id);
    }

    @Post()
    async create(@Body() createDrop: Drop):Promise<Drop> {
        return this.ds.upsert(createDrop);
    }

    @Put(':id')
    async update(@Body() updateDrop: Drop):Promise<Drop> {
        return this.ds.upsert(updateDrop);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<boolean> {
        return this.ds.delete(id);
    }
}