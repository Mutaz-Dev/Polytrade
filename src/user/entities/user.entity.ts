import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { BaseEntity } from "../../shared/base.entity";

import { AppConfig } from "../../app.config";
import { UserRelation } from "./user-relation.entity";
import { Like } from "../../post/entities/like.entity";


@Entity({name:"user"})
export class User extends BaseEntity {
    
    @Column({name:"user_name", unique: true})
    username:string;

    @Column({name:"email", unique:true})
    email:string

    @Column({name:"password"})
    password:string;

    @Column({name:"first_name", nullable: true})
    firstName:string;

    @Column({name:"last_name", nullable: true})
    lastName:string;

    @OneToMany(() => UserRelation, (userRelation) => userRelation.source)
    userRelationSource: UserRelation[];

    @OneToMany(() => UserRelation, (userRelation) => userRelation.target)
    userRelationTarget: UserRelation[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];
    
    @BeforeInsert()
    async hashPassword() {
        const saltRound: number = AppConfig.get<number>('SALT_ROUNDS');
        //TODO: USE SALTROUND VARIABLE INSTEAD OF STATIC NUMBER VALUE OF 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await Promise.resolve(bcrypt.hashSync(this.password, salt));
        this.password = hashedPassword;
    }
}
