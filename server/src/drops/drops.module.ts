import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsModule } from 'src/tags/tags.module';
import { DropEntity } from './drop.entity';
import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

@Module({
    imports: [TagsModule, TypeOrmModule.forFeature([DropEntity])],
    providers: [DropsService],
    controllers: [DropsController]
})
export class DropsModule {}
