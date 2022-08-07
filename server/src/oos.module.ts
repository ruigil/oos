import { Module } from '@nestjs/common';
import { OOSController } from './oos.controller';
import { OOSService } from './oos.service';
import { DropsController } from './drops/drops.controller';
import { TagsController } from './tags/tags.controller';
import { TagsService } from './tags/tags.service';
import { DropsService } from './drops/drops.service';
import { StorageService } from './storage/storage.service';
import { AuthModule } from './auth/auth.module';
import { DropsModule } from './drops/drops.module';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { DropEntity } from './drops/drop.entity';
import { TagEntity } from './tags/tag.entity';
import { UserEntity } from './user/user.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule, 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'client'),
      exclude: ['/api*'],
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: '../db/oos.data',
      autoLoadEntities: true,
      synchronize: true
    }),
    ScheduleModule.forRoot(),    
    DropsModule, 
    TagsModule,
    UserModule
  ],
  controllers: [OOSController],
  providers: [OOSService],
})
export class OOSModule {}
