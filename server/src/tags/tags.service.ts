import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { Tag } from '../models/tag';
import { TagEntity } from './tag.entity';

const TAGS = [
    new Tag({ id:"NOTE_TYPE", name:"NOTE", count: 0 , color: "note-icon", icon: 'note' }),
    new Tag({ id:"RATE_TYPE", name:"RATE", count: 0 , color: "rate-icon", icon: 'star_rate'  }),
    new Tag({ id:"TASK_TYPE", name:"TASK", count: 0 , color: "task-icon", icon: 'folder' }),
    new Tag({ id:"GOAL_TYPE", name:"GOAL", count: 0 , color: "goal-icon", icon: 'center_focus_strong' }),
    new Tag({ id:"MONEY_TYPE", name:"MONEY", count: 0 , color: "money-icon", icon: 'monetization_on' }),
    new Tag({ id:"SYS_TYPE", name:"SYSTEM", count: 0 , color: "system-icon", icon: 'brightness_7'}),
    new Tag({ id:"PHOTO_TYPE", name:"PHOTO", count: 0 , color: "photo-icon", icon: 'photo_camera'}),
    new Tag({ id:"OOS_STREAM", name:"OOS", count: 0 , color: "stream-icon", icon: 'water'}),
]

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity) private trepo: Repository<TagEntity>,
    ) {
        TAGS.forEach( t => this.create(t) );
    }

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