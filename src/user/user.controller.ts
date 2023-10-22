import { Controller, Get, Post, Body, Res, Patch, Param, Delete, HttpStatus, Put, InternalServerErrorException, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto, UserIdDto } from './dto/user.dto';
import { Serialize } from '@src/interceptors/serializer.interceptor';
import { IAPIResponse } from '@src/shared/interfaces/api-respone.interface';
import { LoginUserDto } from './dto/login.dto';
import { AcceptRelationDto, AddRelationDto } from './dto/relation.dto';
import { IRelation } from './interfaces/relation.interface';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from '@src/shared/constants/roles';
import { apiResponse } from '@src/shared/api-response';
import { UserDto } from './dto/user.dto';
import { UserRelation } from './entities/user-relation.entity';



@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}
  apiRes: IAPIResponse;


  @Post('/signup')
  @Serialize(CreateUserDto)
  async create(@Body() createUserDto: CreateUserDto, @Req() req: Request, @Res() res: Response) {
    await this.userService.create(createUserDto);
    const { user, token } = await this.userService.signin(createUserDto);
    this.apiRes = apiResponse("user created successfully!", req.url, { token, ...user })
    res.status(HttpStatus.CREATED).cookie('token', token).json(this.apiRes);
  }


  @Post('/signin')
  @Serialize(LoginUserDto)
  async signin(@Body() loginUserDTO: LoginUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const { user, token } = await this.userService.signin(loginUserDTO);
      this.apiRes = apiResponse("user logged successfully!", req.url, { token, ...user })
      res.status(HttpStatus.OK).cookie('token', token).json(this.apiRes);
  }


  @Post('/relation')
  @Auth(RolesEnum.USER)
  @Serialize(AddRelationDto)
  async addRelation( @Body() addRelationDto: AddRelationDto, @Req() req: Request, @Res() res: Response ) {      
    const relation: IRelation = await this.userService.addRelation(addRelationDto);
    this.apiRes = apiResponse("relation request sent succesfully!", req.url, relation)
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Patch('/relation')
  @Auth(RolesEnum.USER)
  @Serialize(AcceptRelationDto)
  async acceptRelation( @Body() acceptRelationDto: AcceptRelationDto, @Req() req: Request, @Res() res: Response ) {
    const relation: IRelation = await this.userService.acceptRelation(acceptRelationDto);
    this.apiRes = apiResponse("relation request accepted succesfully!", req.url, relation)
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Get('/relation/:id')
  @Auth(RolesEnum.USER) 
  async findUserRelations( @Param('id') id: string, @Req() req: Request, @Res() res: Response ) {
    const relations: UserRelation[] = await this.userService.findUserRelations(parseInt(id));
    this.apiRes = apiResponse("user relations requested succesfully!", req.url, { ...relations})
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }
}
