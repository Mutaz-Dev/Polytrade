import { IsString } from "@nestjs/class-validator";

export class AddRelationDto {

    @IsString()
    sourceId: number;

    @IsString()
    targetId: number;
}


export class AcceptRelationDto {
    @IsString()
    id: number;

    @IsString()
    targetId: number;
}