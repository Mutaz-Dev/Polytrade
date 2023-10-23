import { Column, Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "@src/shared/base.entity";
import { User } from "./user.entity";
import { RelationStatus } from "@src/shared/constants/enums";




@Entity({name:"user_relation"})
export class UserRelation extends BaseEntity {
    
    @ManyToOne(() => User, (user) => user.id, {eager: true})
    source: number

    @ManyToOne(() => User, (user) => user.id, {eager: true})
    target: number

    @Column({name:"status"})
    status: RelationStatus;

}