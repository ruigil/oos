import { Injectable } from '@nestjs/common';

@Injectable()
export class OOSService {
  getHello(): string {
    return 'Hello OceanOS!';
  }
}
