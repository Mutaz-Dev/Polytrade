import { BeforeInsert, Column, Entity, ManyToOne } from "typeorm";
import * as bcrypt from 'bcrypt';
import { BaseEntity } from "@src/shared/base.entity";
import { Role } from "./role.entity";




@Entity({name:"users"})
export class User extends BaseEntity {
    
    
    @Column({name:"user_name", nullable: true})
    username:string;

    @Column({name:"first_name", nullable: true})
    firstName:string;

    @Column({name:"last_name", nullable: true})
    lastName:string;

    @Column({name:"password"})
    password:string;

    @Column({name:"email", unique:true})
    email:string

    @ManyToOne(() => Role, (role) => role.users)
    role: Role;

    
    @BeforeInsert()
    async hashPassword() {
        const saltRound: number = this.configService.get<number>('SALT_ROUNDS');
        const salt = await bcrypt.genSalt(saltRound);
        const hashedPassword = await Promise.resolve(bcrypt.hashSync(this.password, salt));
        this.password = hashedPassword;
    }


}
