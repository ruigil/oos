import { NestFactory } from '@nestjs/core';
import { OOSModule } from './oos.module';

async function bootstrap() {
  const app = await NestFactory.create(OOSModule);
  await app.listen(3000);
}
bootstrap();
