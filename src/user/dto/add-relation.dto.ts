import { IsString } from "@nestjs/class-validator";

export class AddRelationDto {

    @IsString()
    sourceUsername: string;

    @IsString()
    targetUsername: string;
}
