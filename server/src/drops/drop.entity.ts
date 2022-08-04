import { TagEntity } from "src/tags/tag.entity";
import { UserEntity } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class DropEntity {

    @PrimaryColumn()
    id: string = "";

    @Column()
    type: string = "";
 
    @Column()
    title: string = "";
 
    @Column({ type: 'simple-json', nullable: true } )
    note?: { content: string };

    @Column({ type: 'simple-json', nullable: true } )
    money?: { value: number, type: string, currency: string };
    
    @Column({ type: 'simple-json', nullable: true } )
    task?: { description: string, date: any, completed: boolean };

    @Column({ type: 'simple-json', nullable: true } )
    system?: { content: string };

    @Column({ type: 'simple-json', nullable: true } )
    rate?: { description: string, value: number };

    @Column({ type: 'simple-json', nullable: true } )
    goal?: { content: string, completed: boolean, totals: Array<number> };
    
    @Column()
    recurrence: string = "";

    @Column()
    date: number = 0;
     
    @CreateDateColumn()
    createdAt: String
 
    @UpdateDateColumn()
    updatedAt: String
 
    @ManyToMany( () => TagEntity, tag => tag.drops)
    tags: TagEntity[]

    @ManyToOne(() => UserEntity, user => user.drops)
    @JoinColumn()
    user: UserEntity;

    public constructor(init?:Partial<DropEntity>) {
        Object.assign(this, init);
    }        
}
