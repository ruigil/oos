import { Module } from '@nestjs/common';

import { StreamsModule } from 'src/streams/streams.module';
import { UsersModule } from 'src/users/users.module';

import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

@Module({
    imports: [StreamsModule, UsersModule],
    providers: [DropsService],
    controllers: [DropsController]
})
export class DropsModule {}
