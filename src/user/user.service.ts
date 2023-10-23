import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

import { LoginUserDto } from './dto/login.dto';
import { ISignIn } from '@src/user/interfaces/signin.interface';
import * as bcrypt from 'bcrypt';
import { IUserFromRequest } from './interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { IUser } from './interfaces/user.interface';
import { UserRelation } from './entities/user-relation.entity';
import { IRelation } from './interfaces/relation.interface';
import { AddRelationDto, AcceptRelationDto } from './dto/relation.dto';
import { RelationStatus } from '@src/shared/constants/enums';




@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
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

    let newUser: User = this.userRepo.create({
      username: createUserDto.username,
      password: createUserDto.password,
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
    });


    newUser = await this.userRepo.save(newUser);

    return {
      id: newUser.id,
      username : newUser.username,
      fullName : newUser.firstName + " " + newUser.lastName,
      email :newUser.email,
    };
  }


  async signin(dto: LoginUserDto | CreateUserDto): Promise<ISignIn> {
    let user: User = await this.validateUser(dto.password, dto.email);
    
    if (!user) throw new BadRequestException('Invalid Credentials');
  
    const payload: IUserFromRequest = {
      id: user.id,
    }
    
    const token: string =  this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.firstName + " " + user.lastName,
      },
      token
    };
  }


  async validateUser(password: string, email: string) {
    const user: User = await this.findOneByEmail(email);

    if (!user) return null;
    if (!bcrypt.compareSync(password, user.password)) return null;
    return user;
  }


  async findOneByEmail(email: string): Promise<User> {
    const user: User = await this.userRepo.findOne({
      where: { email: email },
    });
    return user;
  }

  async findOneById(id: number): Promise<User> {
    const user: User = await this.userRepo.findOne({
          where: {id: id},
       })
    return user;
  }


  async addRelation(targetId: number, userId: number): Promise<IRelation> {
    if (userId == targetId)
      throw new BadRequestException("user cannot sent request to himself")

    let sourceUser: User = await this.findOneById(userId);
    let targetUser: User = await this.findOneById(targetId);

    if (!targetUser) 
      throw new BadRequestException(`user with id: ${targetId} is not found`);

    let relations: UserRelation[] = await this.findRelationBySourceAndTarget(sourceUser.id, targetUser.id)
    if(relations.length > 2) {
      throw new InternalServerErrorException('contact admin, db data inconsistency')
    }

    if(relations.length > 0) {
      if (relations[0].status == RelationStatus.ACTIVE)
        throw new BadRequestException(`the relation is already existed`);
      
      if (relations[0].status == RelationStatus.REQUESTED)
        throw new BadRequestException(`the relation request is already sent`);

      if (relations[0].status == RelationStatus.BLOCKED)
        throw new BadRequestException(`the user is blocked by ${targetUser.username}`);
    }

    let newRelation: UserRelation = this.userRelationRepo.create({
      source : sourceUser.id,
      target : targetUser.id,
      status: RelationStatus.REQUESTED
    });
    
    newRelation = await this.userRelationRepo.save(newRelation);

    return {
      id: newRelation.id,
      sourceId: newRelation.source,
      targetId: newRelation.target,
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


  async findRelationBySourceAndTarget(sourceId: number, targetId: number): Promise<UserRelation[]> {
    return await this.userRelationRepo.createQueryBuilder('user_relation')
      .select("id, status as status")
      .where("user_relation.sourceId = :sourceId", { sourceId: sourceId })
      .orWhere("user_relation.targetId = :targetId", { targetId: targetId })
      .execute();
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
      targetId: relation.target,
      sourceId: relation.source,
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


  async findUserRelations(userId: number): Promise<UserRelation[]> {
    return await this.userRelationRepo.createQueryBuilder('user_relation')
    .select()
    .where("user_relation.sourceId = :sourceId", { sourceId: userId })
    .orWhere("user_relation.targetId = :targetId", { targetId: userId })
    .execute();
  }
}
