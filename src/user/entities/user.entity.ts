import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { BaseEntity } from "@src/shared/base.entity";
import { Role } from "./role.entity";
import { AppConfig } from "@src/app.config";
import { UserRelation } from "./user-relation.entity";


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

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    // @OneToMany(() => UserRelation, (userRelation) => userRelation.sourceID, {eager: true})
    // sourceID: UserRelation;

    // @OneToMany(() => UserRelation, (userRelation) => userRelation.targetID, {eager: true})
    // targetID: UserRelation;
    
    @BeforeInsert()
    async hashPassword() {
        const saltRound: number = AppConfig.get<number>('SALT_ROUNDS');
        //TODO: USE SALTROUND VARIABLE INSTEAD OF STATIC NUMBER VALUE OF 10
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await Promise.resolve(bcrypt.hashSync(this.password, salt));
        this.password = hashedPassword;
    }


}
