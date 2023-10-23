import { IsNumber } from "@nestjs/class-validator";

export class AddRelationDto {
    @IsNumber()
    targetId: number;
}


export class AcceptRelationDto {
    @IsNumber()
    id: number;
}