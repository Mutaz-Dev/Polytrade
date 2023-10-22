import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Relation, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Role } from './entities/role.entity';
import { RolesEnum } from '@src/shared/constants/roles';
import { LoginUserDto } from './dto/login.dto';
import { ISignIn } from '@src/user/interfaces/signin.interface';
import * as bcrypt from 'bcrypt';
import { IUserFromRequest } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';
import { UserRelation } from './entities/user-relation.entity';
import { IRelation } from './interfaces/relation.interface';
import { AddRelationDto, AcceptRelationDto } from './dto/relation.dto';
import { RelationStatus } from '@src/shared/enums';



@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(UserRelation) private userRelationRepo: Repository<UserRelation>,
    private readonly jwtService:JwtService,
  ) {}


  async create(createUserDto: CreateUserDto): Promise<IUser> {
    let user: User = await this.userRepo.findOne({
      where: [
        { email: createUserDto.email }, 
        { username: createUserDto.username }],
    });

    if (user != null) {
      throw new BadRequestException('user already registered');
    }

    const role: Role = await this.roleRepo.findOne({
      where: { name: RolesEnum.USER },
    });
    
    if (role == null) {
      throw new InternalServerErrorException(
        `Role ${RolesEnum.USER} not found`,
      );
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

    user.role = role;

    let newUser: User = await this.userRepo.save(user);

    return {
      id: newUser.id,
      username : newUser.username,
      fullName : newUser.firstName + " " + newUser.lastName,
      email :newUser.email,
      role : newUser.role.name,
    };
  }


  async signin(dto: LoginUserDto | CreateUserDto): Promise<ISignIn> {
    let user: User = await this.validateUser(dto.password, dto.email);
    
    if (!user) throw new BadRequestException('Invalid Credentials');
  
    const payload: IUserFromRequest = {
      id: user.id,
      role:user.role.name
    }
    
    const token: string =  this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.firstName + " " + user.lastName,
        role: user.role.name
      },
      token
    };
  }


  async validateUser(password: string, email: string) {
    const user: User = await this.findOne(email);

    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    return user;
  }


  async findOne(email: string): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: { email: email },
      relations: ['role'],
    });
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: [
        { id: id }
      ],
      relations: ['role'],
    });
    return user;
  }


  async addRelation(addRelationDto: AddRelationDto): Promise<IRelation> {
    let sourceUser: User = await this.findOneById(addRelationDto.sourceId)
    let targetUser: User = await this.findOneById(addRelationDto.targetId)
    if (!targetUser) 
      throw new BadRequestException(`user with id: ${addRelationDto.targetId} is not found`);

    let relation: UserRelation = await this.findRelationBySourceAndTarget(sourceUser.id, targetUser.id)
    if(relation){
      if (relation.status == RelationStatus.ACTIVE)
        throw new BadRequestException(`the relation is already existed`);
      
      if (relation.status == RelationStatus.REQUESTED)
        throw new BadRequestException(`the relation request is already sent`);

      if (relation.status == RelationStatus.BLOCKED)
        throw new BadRequestException(`the user is blocked by ${targetUser.username}`);
    }

    relation = this.userRelationRepo.create({
      sourceId : sourceUser.id,
      targetId : targetUser.id,
      status: RelationStatus.REQUESTED
    });
    
    let newRelation: UserRelation = await this.userRelationRepo.save(relation);

    return {
      id: newRelation.id,
      sourceId: newRelation.sourceId,
      targetId: newRelation.targetId,
      createdAt: newRelation.created_at,
      status: newRelation.status
    };
  }


  async findRelation(id: number): Promise<UserRelation> {
    return await this.userRelationRepo.findOne({
      where: [
        { id : id}
      ],
    })
  }


  async findRelationBySourceAndTarget(sourceId: number, targetId: number): Promise<UserRelation> {
    return await this.userRelationRepo.findOne({
      where: [
        { sourceId : sourceId, targetId : targetId }
      ],
    })
  }


  async acceptRelation(acceptRelationDto: AcceptRelationDto): Promise<IRelation> {
    let relation = await this.findRelation(acceptRelationDto.id)
    if (!relation)
      throw new BadRequestException(`the relation is not existed`);
    if (relation.status != RelationStatus.REQUESTED)
      throw new BadRequestException(`the relation status should be requested`);
      await this.updateRelationStatus(relation.id, RelationStatus.ACTIVE);
      relation = await this.findRelation(acceptRelationDto.id);

    return {
      id: relation.id,
      targetId: relation.targetId,
      sourceId: relation.sourceId,
      createdAt: relation.created_at,
      updatedAt: relation.updated_at,
      status: relation.status,
    }
  }


  async updateRelationStatus(id: number, status: RelationStatus) {
    return await this.userRelationRepo.createQueryBuilder('user_relation')
    .update(UserRelation)
    .set({ status: status })
    .where("id = :id", { id: id })
    .execute();
  }


  async getRelations(userId: number): Promise<UserRelation[]> {
    return await this.userRelationRepo.createQueryBuilder('user_relation')
    .select()
    .where("source_id = :sourceId", { sourceId: userId })
    .orWhere("target_id = :targetId", { targetId: userId })
    .execute();
  }











  findAll() {
    return `This action returns all user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
