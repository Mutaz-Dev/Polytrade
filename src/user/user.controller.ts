import { Controller, Get, Post, Body, Res, Patch, Param, Delete, HttpStatus, Put, InternalServerErrorException, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '@src/interceptors/serializer.interceptor';
import { IAPIResponse } from '@src/shared/interfaces/api-respone.interface';
import { LoginUserDto } from './dto/login.dto';
import { AcceptRelationDto, AddRelationDto } from './dto/relation.dto';
import { IRelation } from './interfaces/relation.interface';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from '@src/shared/constants/roles';
import { apiResponse } from '@src/shared/api-response';



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
  async signin(@Body() loginUserDTO: LoginUserDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
      const { user, token } = await this.userService.signin(loginUserDTO);
      this.apiRes = apiResponse("user logged successfully!", req.url, { token, ...user })
      res.status(HttpStatus.OK).cookie('token', token).json(this.apiRes);
  }


  @Post('/relation')
  @Auth(RolesEnum.USER)
  async addRelation( @Body() addRelationDto: AddRelationDto, @Req() req: Request, @Res() res: Response ) {      
        const relation: IRelation = await this.userService.addRelation(addRelationDto);
        this.apiRes = apiResponse("relation request sent succesfully!", req.url, { ...relation})
        res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Patch('/relation')
  @Auth(RolesEnum.USER)
  async acceptRelation( @Body() acceptRelationDto: AcceptRelationDto, @Req() req: Request, @Res() res: Response ) {
        const relation: IRelation = await this.userService.acceptRelation(acceptRelationDto);
        this.apiRes = apiResponse("relation request accepted succesfully!", req.url, { ...relation})
        res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
