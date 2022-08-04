import { UserEntity } from "src/user/user.entity";
import { DropEntity } from "src/drops/drop.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TagEntity {

    @PrimaryColumn()
    id: string = "";

    @Column()
    name: string = "";
 
    @Column()
    color: string = "";
 
    @Column()
    icon: string = "";

    @ManyToMany(() => DropEntity, drop => drop.tags)
    @JoinTable()
    drops: DropEntity[]
    
    @ManyToOne(() => UserEntity, user => user.tags)
    @JoinColumn()
    user: UserEntity;

    @CreateDateColumn()
    createdAt: String
 
    @UpdateDateColumn()
    updatedAt: String

    public constructor(init?:Partial<TagEntity>) {
        Object.assign(this, init);
    }      
}
