import { Expose } from "@nestjs/class-transformer";
import { IsDate, IsNumber, IsString } from "@nestjs/class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class PostDto {
    @Expose()
    @IsNumber()
    id: number;
  
    @Expose()
    @IsNumber()
    ownerId: number;
  
    @Expose()
    @IsString()
    title: string;
    
    @Expose()
    @IsString()
    context: string

    @Expose()
    @IsDate()
    creationDate: Date;
}
  



export class CreatePostDto {
  @Expose()
  @IsNumber()
  ownerId: number;

  @Expose()
  @IsString()
  title: string;
  
  @Expose()
  @IsString()
  context: string
}
