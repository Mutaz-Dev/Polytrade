import { Expose } from "@nestjs/class-transformer";
import { IsDate, IsNumber } from "@nestjs/class-validator";


export class LikeDto {
    @Expose()
    @IsNumber()
    id: number;
  
    @Expose()
    @IsNumber()
    postId: number;

    @Expose()
    @IsNumber()
    userId: number;

    @Expose()
    @IsDate()
    creationDate: Date;
}


export class CreateLikeDto {
    @Expose()
    @IsNumber()
    postId: number;

    @Expose()
    @IsNumber()
    userId: number;
}