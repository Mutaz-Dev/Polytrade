import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IUser } from './interfaces/user.interface';


describe('UserController', () => {
  let userController: UserController;
  let userService : UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});