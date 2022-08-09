import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/tags/tag.entity';
import { TagsModule } from 'src/tags/tags.module';
import { UserEntity } from 'src/user/user.entity';
import { DropEntity } from './drop.entity';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

@Module({
    imports: [TagsModule, TypeOrmModule.forFeature([DropEntity,TagEntity,UserEntity])],
    providers: [DropsService],
    controllers: [DropsController]
})
export class DropsModule {}
