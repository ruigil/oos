import { Entity, OneToOne, JoinColumn,Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { DropEntity } from 'src/drops/drop.entity'
import { TagEntity } from 'src/tags/tag.entity'

@Entity()
export class UserEntity {
   @PrimaryColumn()
   id: string

   @Column()
   username: string

   @Column({ type: 'simple-json', nullable: true } )
   settings: { transaction: { currency: string }, home: { preview: string }, system: { day: boolean, timezone:string } };

   @CreateDateColumn()
   createdAt : String

   @UpdateDateColumn()
   updatedAt : String

   @OneToMany(() => DropEntity, drop => drop.user)
   @JoinColumn()
   drops: DropEntity[];
   
   @OneToMany(() => TagEntity, tag => tag.user)
   @JoinColumn()
   tags: TagEntity[];

   public constructor(init?:Partial<UserEntity>) {
      Object.assign(this, init);
  }     
}