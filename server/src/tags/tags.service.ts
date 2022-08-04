import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Tag } from '../models/tag';
import { TagEntity } from './tag.entity';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity) private trepo: Repository<TagEntity>,
    ) {}

    create(tag:Tag):Promise<TagEntity> {
        return this.trepo.save(new TagEntity( {...tag}));
    }

    update(tag:Tag): Promise<TagEntity> {
        return this.trepo.save(new TagEntity( {...tag}));
    }

    get(id:string):Promise<TagEntity> {
        return this.trepo.findOneBy({ id:id })
    }

    delete(id:string):Promise<DeleteResult> {
        return this.trepo.delete(id);
    }

    findAll():Promise<TagEntity[]> {
        return this.trepo.find();
    }

    findByIds(ids:string[]):Promise<TagEntity[]> {
        return this.trepo.findBy({
            id: In(ids)
        })
    }
}