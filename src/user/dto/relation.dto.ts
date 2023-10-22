import { IsNumber } from "@nestjs/class-validator";

export class AddRelationDto {

    @IsNumber()
    sourceId: number;

    @IsNumber()
    targetId: number;
}


export class AcceptRelationDto {
    @IsNumber()
    id: number;
}