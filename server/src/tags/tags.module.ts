import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropEntity } from 'src/drops/drop.entity';
import { UserEntity } from 'src/user/user.entity';
import { TagEntity } from './tag.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
    imports: [TypeOrmModule.forFeature([TagEntity]) ],
    providers: [TagsService],
    controllers: [TagsController],
    exports: [TagsService]
})
export class TagsModule {}
