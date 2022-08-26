import { Module } from '@nestjs/common';
import { StreamsController } from './streams.controller';
import { StreamsService } from './streams.service';

@Module({
    imports: [],
    providers: [StreamsService],
    controllers: [StreamsController],
    exports: [StreamsService]
})
export class StreamsModule {}
