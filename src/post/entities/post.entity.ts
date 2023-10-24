import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../shared/base.entity";
import { Like } from "./like.entity";

@Entity({name:"post"})
export class Post extends BaseEntity {

    @Column({name:"owner_id"})
    ownerId: number;

    @Column({name:"title"})
    title: string;

    @Column({name:"context"})
    context: string

    @OneToMany(() => Like, (like) => like.post)
    likes: Like[];
}
