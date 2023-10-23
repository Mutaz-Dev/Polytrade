export interface IUser {
      id: number,
      username: string;
      password?: string;
      email: string;
      fullName: string;
      registrationDate?: Date;
}


export interface IUserFromRequest{
      id: number;
}
  
  
  
  
    