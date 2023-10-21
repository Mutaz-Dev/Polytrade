import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.entity';
import { RolesEnum } from '@src/shared/constants/roles';
import { LoginUserDto } from './dto/login.dto';
import { ISignIn } from '@src/user/interfaces/signin.interface';
import * as bcrypt from 'bcrypt';
import { UserFromRequest } from '@src/shared/types';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';



@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private readonly jwtService:JwtService,
  ) {}


  async create(createUserDto: CreateUserDto): Promise<IUser> {
    let user = await this.userRepo.findOne({
      where: [
        { email: createUserDto.email }, 
        { username: createUserDto.username }],
    });

    if (user != null) {
      throw new BadRequestException('user already registered');
    }

    user = this.userRepo.create({
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      // TODO: COMPLETE USER ROLE ENUM INSERTION
      // role: RolesEnum.USER 
    });

    const role = await this.roleRepo.findOne({
      where: { name: RolesEnum.USER },
    });
    
    if (role == null) {
      throw new InternalServerErrorException(
        `Role ${RolesEnum.USER} not found`,
      );
    }

    user.role = role;

    let savedUser = await this.userRepo.save(user);

    return {
      username : savedUser.username,
      fullName : savedUser.firstName + " " + savedUser.lastName,
      email :savedUser.email,
      role : savedUser.role.name,
    };
  }


  async signin(dto: LoginUserDto | CreateUserDto): Promise<ISignIn> {

    let user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new BadRequestException('Invalid Credentials');

    const payload: UserFromRequest = {
      id: user.id,
      role:user.role.name
    }
    const token =  this.jwtService.sign(payload);

    return {
      user: {
        username: user.username,
        email: user.email,
        fullName: user.firstName + " " + user.lastName,
        role: user.role.name
      },
      token
    };
  }


  async validateUser(email: string, password: string) {
    const user: User = await this.findOneByEmail(email);
    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    return user;
  }


  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
