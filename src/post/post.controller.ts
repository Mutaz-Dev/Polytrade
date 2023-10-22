import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/post.dto';
import { Serialize } from '@src/interceptors/serializer.interceptor';
import { Auth } from '@src/user/decorators/auth.decorator';
import { RolesEnum } from '@src/shared/constants/roles';
import { IPost } from './interfaces/post.interface';
import { apiResponse } from '@src/shared/api-response';
import { IAPIResponse } from '@src/shared/interfaces/api-respone.interface';
import { CreateLikeDto } from './dto/like.dto';
import { IUser } from '@src/user/interfaces/user.interface';




@Controller('post')
export class PostController {

  constructor(private readonly postService: PostService) {}
  apiRes: IAPIResponse;


  @Post()
  @Auth(RolesEnum.USER)
  @Serialize(CreatePostDto)
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request, @Res() res: Response) {
    const newPost: IPost = await this.postService.create(createPostDto);
    this.apiRes = apiResponse("post created successfully!", req.url, newPost)
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Get('likes/:postId')
  @Auth(RolesEnum.USER)
  async countPostLikes(@Param('postId') postId: number, @Req() req: Request, @Res() res: Response) {
    const likesCount: number = await this.postService.countPostLikes(postId);
    this.apiRes = apiResponse("user posts requested succesfully!", req.url, likesCount)
    res.status(HttpStatus.CREATED).json(this.apiRes); 
  }

  @Get('likers/:postId')
  async findPostLikers(@Param('postId') postId: number, @Req() req: Request, @Res() res: Response) {
    const likers: IUser[] = await this.postService.findPostLikers(postId);
    this.apiRes = apiResponse("user post requested succesfully!", req.url, { ...likers })
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Post('/like')
  @Auth(RolesEnum.USER)
  @Serialize(CreateLikeDto)
  async createLike(@Body() createLikeDto: CreateLikeDto, @Req() req: Request, @Res() res: Response) {
    const newLike = await this.postService.createLike(createLikeDto);
    this.apiRes = apiResponse("like created successfully!", req.url, newLike)
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }


  @Get(':userId')
  @Auth(RolesEnum.USER)
  async findAll(@Param('userId') userId: number, @Req() req: Request, @Res() res: Response) {
    const posts: IPost[] = await this.postService.findAll(userId);
    this.apiRes = apiResponse("user posts requested succesfully!", req.url, { ...posts})
    res.status(HttpStatus.CREATED).json(this.apiRes); 
  }

  @Get(':userId/:postId')
  async findOne(@Param('userId') userId: number, @Param('postId') postId: number, @Req() req: Request, @Res() res: Response) {
    const post: IPost = await this.postService.findOne(userId, postId);
    this.apiRes = apiResponse("user post requested succesfully!", req.url, post)
    res.status(HttpStatus.CREATED).json(this.apiRes);
  }

}
