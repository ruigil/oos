import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ JwtModule],
  providers: [AuthService]
})
export class AuthModule {}
