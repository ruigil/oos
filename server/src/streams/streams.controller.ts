import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { Stream } from '../models/stream';

import { StreamsService } from './streams.service';

@Controller('api/streams')
export class StreamsController {

    constructor(private ts: StreamsService) {}

    @Post()
    async create(@Body() tag: Stream):Promise<Stream> {
        return this.ts.upsert(tag);
    }

    @Get()
    async findAll():Promise<Stream[]> {
        return this.ts.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<Stream> {
        return this.ts.get(id);
    }

    @Put(':id')
    async update(@Body() tag: Stream):Promise<Stream> {
        return this.ts.upsert(tag);
    }

    @Delete(':id')
    async remove(@Param('id') id: string):Promise<boolean> {
        return this.ts.delete(id);
    }
}
