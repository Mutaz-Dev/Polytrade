import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { Role } from './entities/role.entity';
import { RolesEnum } from '@src/shared/constants/roles';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}


  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    let userByEmail = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });

    if (userByEmail != null) {
      throw new BadRequestException('email already used');
    }

    let user = this.userRepo.create({
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
      id : savedUser.id,
      fullName : savedUser.firstName + " " + savedUser.lastName,
      email :savedUser.email,
      registrationDate : savedUser.created_at,
      role : savedUser.role,
    };
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
