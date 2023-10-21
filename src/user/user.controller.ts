import { Controller, Get, Post, Body, Res, Patch, Param, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '@src/interceptors/serializer.interceptor';
import { UserDto } from './dto/user.dto';
import { APIResponse } from '@src/shared/interfaces/api.respone';
import { STATUS_CODES } from 'http';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  apiRes: APIResponse;

  @Post('/signup')
  @Serialize(UserDto)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const newUser = await this.userService.create(createUserDto);


      // TODO: LOGIN USER AND RESPONSE WITH THE TOKEN BESIDE USER-DTO 

      this.apiRes = {
        //TODO: DEVELOP STATIC MESSAGES
        status_message: "user created successfully!",
        res_data: newUser
      }
      res.status(201).json(this.apiRes);
    } catch (err) {
      // TODO: MODIFY ERROR HANDELING
      this.apiRes = {
        status_message: "Internal Server Error",
      }
      res.status(500).json(this.apiRes);
    }
    
  }


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
