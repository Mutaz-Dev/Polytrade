import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "@src/shared/base.entity";
import { User } from "./user.entity";
import { RelationStatus } from "@src/shared/enums";




@Entity({name:"user_relation"})
export class UserRelation extends BaseEntity {
    
    @ManyToOne(() => User, (user) => user.id, {eager: true})
    @Column({name:"source_id"})
    sourceId: number

    @ManyToOne(() => User, (user) => user.id, {eager: true})
    @Column({name:"target_id"})
    targetId: number

    @Column({name:"type"})
    status: RelationStatus;

}
