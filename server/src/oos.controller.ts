import { Controller, Get } from '@nestjs/common';
import { OOSService } from './oos.service';

@Controller("api")
export class OOSController {
  constructor(private readonly appService: OOSService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
