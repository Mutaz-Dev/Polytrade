export interface IPost {
      id: number,
      ownerId: number;
      title: string;
      context: string;
      creationDate?: Date;
} 