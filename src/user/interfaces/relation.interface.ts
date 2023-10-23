import { RelationStatus } from "@src/shared/constants/enums";

export interface IRelation {
      id: number;
      targetId: number;
      sourceId: number;
      createdAt: Date;
      updatedAt?: Date;
      status: RelationStatus;
}

  
  
  
    