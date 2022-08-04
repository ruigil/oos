import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    AuthModule, 
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'oos-db',
      autoLoadEntities: true,
      synchronize: true
    }),
    DropsModule, 
    TagsModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
