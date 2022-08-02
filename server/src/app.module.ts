import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DropsController } from './drops/drops.controller';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { DropsService } from './drops/drops.service';

@Module({
  imports: [],
  controllers: [AppController, DropsController, TagsController],
  providers: [AppService, TagsService, DropsService],
})
export class AppModule {}
