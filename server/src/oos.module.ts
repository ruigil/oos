import { Module } from '@nestjs/common';
import { OOSController } from './oos.controller';
import { OOSService } from './oos.service';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DropsModule } from './drops/drops.module';
import { StreamsModule } from './streams/streams.module';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    AuthModule, 
    DropsModule, 
    StreamsModule, 
    UsersModule, 
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..', 'client'),
      exclude: ['/api*'],
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [OOSController],
  providers: [OOSService],
})
export class OOSModule {}
