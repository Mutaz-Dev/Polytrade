import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto';
import { IPost } from './interfaces/post.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { ILike } from './interfaces/like.interface';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/like.dto';
import { IUser } from '@src/user/interfaces/user.interface';
import { User } from '@src/user/entities/user.entity';
import { UserIdDto } from '@src/user/dto/user.dto';


@Injectable()
export class PostService {

  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Like) private likeRepo: Repository<Like>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}


  async create(createPostDto: CreatePostDto): Promise<IPost> {
    let post: Post = this.postRepo.create({
      ownerId: createPostDto.ownerId,
      title: createPostDto.title,
      context: createPostDto.context
    });

    let newPost: Post = await this.postRepo.save(post);

    return {
      id: newPost.id,
      ownerId : newPost.ownerId,
      title : newPost.title,
      context : newPost.context,
      creationDate : newPost.created_at,
    };
  }


  async findAll(ownerId: number): Promise<IPost[] | any> {
    return await this.postRepo.createQueryBuilder('post')
    .select()
    .where("owner_id = :ownerId", { ownerId: ownerId })
    .execute();
  }


  async findOne(ownerId: number, id: number): Promise<IPost> {
    let post =  await this.postRepo.findOne({
      where: [{ id : id, ownerId : ownerId }],
    })

    if (!post)
      throw new BadRequestException("post id does not exists!") 

    return post;
  }


  async createLike(createLikeDto: CreateLikeDto): Promise<ILike> {
    const likes: ILike[] = await this.findLike(createLikeDto.postId, createLikeDto.userId);

    if (likes.length > 0)
    throw new BadRequestException("post already liked!")

    const like: Like = this.likeRepo.create({
      post: createLikeDto.postId,
      user: createLikeDto.userId,
    });

    let newLike = await this.likeRepo.save(like)
    return {
      id: newLike.id,
      postId: newLike.post,
      userId: newLike.user,
      creationDate: newLike.created_at
    }
  }

  async findLike(postId: number, userId: number): Promise<ILike[] | any> {
    return await this.likeRepo.createQueryBuilder('like')
    .select()
    .where("like.post = :postId", { postId: postId })
    .andWhere("like.user = :userId", { userId: userId })
    .execute();
  }

  async countPostLikes(postId: number): Promise<number | any> {
    return await this.likeRepo.createQueryBuilder('like')
    .select("COUNT(*)")
    .where("like.post = :postId", { postId: postId })
    .execute();
  }

  async findPostLikers(postId: number): Promise<IUser[] | any> {
    const likersIds : any[] = await this.likeRepo.createQueryBuilder('like')
    .select("like.user")
    .where("like.post = :postId", { postId: postId })
    .execute();

    const likersIdsArray = likersIds.map(item => item.userId)

    if (likersIdsArray.length == 0)
      return null
    
    const likers = await this.userRepo.createQueryBuilder('user')
    .select("user.id, user.username")
    .where('user.id IN (:...likersIdsArray)', { likersIdsArray })
    .execute()

    return likers
  }
}
