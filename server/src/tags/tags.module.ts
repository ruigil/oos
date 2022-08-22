import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
    imports: [],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService]
})
export class TagsModule {}
