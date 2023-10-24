import { Entity, ManyToOne } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Post } from "./post.entity"
import { User } from "../../user/entities/user.entity";

@Entity({name:"like"})
export class Like extends BaseEntity {

    @ManyToOne(() => Post, (post) => post.id, {eager: true})
    post: number;
    
    @ManyToOne(() => User, (user) => user.id, {eager: true})
    user: number;

}
