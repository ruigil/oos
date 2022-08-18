import { Controller, Get, Post, UploadedFile, UseInterceptors, StreamableFile, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';

import { OOSService } from './oos.service';

@Controller("api")
export class OOSController {
  constructor(private readonly appService: OOSService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    //console.log(file);
    return file;
  }  

  @Get('file/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    const file = createReadStream(join("/oos/db/upload", filename));
    return new StreamableFile(file);
  }

}
