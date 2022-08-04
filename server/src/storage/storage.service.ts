import { Injectable } from '@nestjs/common';
import { Transform } from 'stream';
import { createReadStream, createWriteStream, WriteStream, ReadStream } from 'fs';
import { Drop } from 'src/models/drop';

@Injectable()
export class StorageService {
    
    transformStream:Transform;

    dfi:ReadStream;
    dfo:WriteStream;

    constructor() {
        this.transformStream = new Transform({ 
            transform(chunk, encoding, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }})        
        this.dfi = createReadStream(`${__dirname}/drops.json`);
        this.dfo = createWriteStream(`${__dirname}/drops-transform.json`);
    }

    readFile() {
        console.log(__dirname);
        this.dfi.pipe(this.transformStream).pipe(this.dfo).on('finish', () => {
            console.log(`Finished transforming the contents`);
        });    
    }

    storeDrops(drops:Drop[]) {
        createWriteStream(`${__dirname}/drops.json`).write(JSON.stringify(drops));
    }

    readDrops(): ReadStream {
        return createReadStream(`${__dirname}/drops.json`);
    }
}
