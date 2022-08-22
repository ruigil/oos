import { Module } from '@nestjs/common';

import { TagsModule } from 'src/tags/tags.module';
import { UserModule } from 'src/user/user.module';

import { DropsController } from './drops.controller';
import { DropsService } from './drops.service';

@Module({
    imports: [TagsModule, UserModule],
    providers: [DropsService],
    controllers: [DropsController]
})
export class DropsModule {}
