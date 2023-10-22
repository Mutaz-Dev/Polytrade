import { Controller, Get, Post, Body, Res, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '@src/interceptors/serializer.interceptor';
import { IAPIResponse } from '@src/shared/interfaces/api.respone';
import { LoginUserDto } from './dto/login.dto';
import { AddRelationDto } from './dto/add-relation.dto';
import { IRelation } from './interfaces/relation.interface';
import { Auth } from './decorators/auth.decorator';
import { RolesEnum } from '@src/shared/constants/roles';



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  apiRes: IAPIResponse;

  @Post('/signup')
  @Serialize(CreateUserDto)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.userService.create(createUserDto);
      const { user, token } = await this.userService.signin(createUserDto);
      console.log(user, token)
      this.apiRes = {
        //TODO: DEVELOP STATIC MESSAGES
        status_message: "user created successfully!",
        res_data: user
      }
      res.status(HttpStatus.CREATED).cookie('token', token).json(this.apiRes);
    } catch(err: any) {

      if (err instanceof Error) {
        err = err.message;
      }

      // TODO: DEVELOP CENTRAL ERROR HANDELING
      this.apiRes = {
        status_message: err,
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.apiRes);
    }
    
  }


  @Post('/signin')
  async signin(
    @Body() loginUserDTO: LoginUserDto,
    //TODO: INFO
    @Res({ passthrough: true }) res: Response,
    ) {
      try {
        const { user, token } = await this.userService.signin(loginUserDTO);
        this.apiRes = {
          status_message: "user logged successfully",
          res_data: user
        }
        res.status(HttpStatus.OK).cookie('token', token).json(this.apiRes);
      } catch (err: any) {
      // TODO: DEVELOP CENTRAL ERROR HANDELING
      if (err instanceof Error) {
        err = err.message;
      }

      this.apiRes = {
        status_message: err,
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.apiRes);
    }
  }


  @Post('/relation')
  @Auth(RolesEnum.USER)
  async addRelation(
    @Body() addRelationDto: AddRelationDto,
    @Res() res: Response,
    ) {
      try {
        const relation: IRelation = await this.userService.addRelation(addRelationDto);
        console.log(relation)
        this.apiRes = {
          status_message: "relation request sent succesfully",
          res_data: relation
        }
        res.status(HttpStatus.CREATED).json(this.apiRes);
      } catch(err: any){
        
        if (err instanceof Error) {
          err = err.message;
        }

        this.apiRes = {
          status_message: err,
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.apiRes);
      }
  }


  @Patch('/relation')
  // TODO: ADD AUTHINTICATION
  // @Auth()
  async acceptRelation(
    @Body() addRelationDto: AddRelationDto,
    @Res() res: Response,
    ) {
      try {
        const relation: IRelation = await this.userService.addRelation(addRelationDto);
        this.apiRes = {
          status_message: "relation request sent succesfully",
          res_data: relation
        }
      } catch(err: any){
        
        if (err instanceof Error) {
          err = err.message;
        }

        this.apiRes = {
          status_message: err,
        }
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(this.apiRes);
      }
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
