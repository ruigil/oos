import { Controller, Get} from '@nestjs/common';

import { OOSService } from './oos.service';

@Controller()
export class OOSController {
  constructor(private readonly ooss: OOSService) {}
  
  @Get()
  async hello():Promise<string> {
      return this.ooss.getHello();
  }
}
