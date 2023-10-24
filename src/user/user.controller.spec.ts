import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtStrategy } from './jwt.strategy';
import { IUser } from './interfaces/user.interface';
import { CreateUserDto } from './dto/user.dto';
import { getMockReq, getMockRes } from '@jest-mock/express'



describe('UserController', () => {
  let userController: UserController;
  let userService : UserService;

  let createUserDto: CreateUserDto = {
    username: "m1", 
    email: "m@m.m", 
    password: "12345678", 
    firstName: "m", 
    lastName: "m"
  }

  let req = getMockReq({url: "testing url"});
  let { res, next, clearMockRes } = getMockRes()
  


  const mockUserService = {
    create: jest.fn(dto => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    signin: jest.fn(dto => {
      return {
        token: "random token",
        user: {
          id: Date.now(),
          fullName: dto.firstName + dto.lastName,
          ...dto
        }
      }
    }),
  }
  const mockJwtStrategy = {}

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, JwtStrategy],
      // imports: [
      //   TypeOrmModule.forFeature([User, UserRelation]),
      //   JwtModule.registerAsync({
      //     inject: [ConfigService],
      //     imports: [ConfigModule],
      //     useFactory: (config: ConfigService) => {
      //       return {
      //         secret: config.get<string>('JWT_TOKEN_SECRET'),
      //         signOptions: {
      //           expiresIn: config.get<string>('JWT_EXPIRATION'),
      //         },
      //       };
      //     },
      //   }),
      // ]
    })
    .overrideProvider(UserService).useValue(mockUserService)
    .overrideProvider(JwtStrategy).useValue(mockJwtStrategy)
    .compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);

  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });


  it('should signup a new user that has a unique username and email', async () => {

    expect(await userController.create(createUserDto, req, res)).toEqual<IUser>({
      id: expect.any(Number),
      username: createUserDto.username,
      email: createUserDto.email,
      fullName: createUserDto.firstName + createUserDto.lastName,
    });
  });
});