import { Module } from '@nestjs/common';
import { OOSController } from './oos.controller';
import { OOSService } from './oos.service';
import { AuthModule } from './auth/auth.module';
import { DropsModule } from './drops/drops.module';
import { TagsModule } from './tags/tags.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
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
