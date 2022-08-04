import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res, StreamableFile, Header } from '@nestjs/common';
import { id } from 'date-fns/locale';
import { DeleteResult } from 'typeorm';
import { Drop } from '../models/drop';
import { DropEntity } from './drop.entity';
import { DropsService } from './drops.service';

@Controller('api/drops')
export class DropsController {

    constructor(private ds: DropsService) {}

    @Post()
    async create(@Body() createDrop: Drop):Promise<DropEntity> {
        return this.ds.create(createDrop);
    }

    @Get()
    //@Header('Content-Type', 'application/json')
    async findAll(): Promise<DropEntity[]> {
        //@Query() query: string
        return this.ds.findAll();        
    }

    @Get('sample')
    //@Header('Content-Type', 'application/json')
    async testSample(): Promise<{result:boolean}> {
        //@Query() query: string
        return this.ds.testSample();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<DropEntity> {
        return this.ds.get(id);
    }

    @Put(':id')
    async update(@Body() updateDrop: Drop):Promise<DropEntity> {
        return this.ds.update(updateDrop);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<DeleteResult> {
        return this.ds.delete(id);
    }
}