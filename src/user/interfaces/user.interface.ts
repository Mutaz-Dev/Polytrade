export interface IUser {
      username: string;
      password?: string;
      email: string;
      fullName: string;
      registrationDate?: Date;
      role: string;
}


export interface IUserFromRequest{
      id: number;
      role: string;
}
  
  
  
  
    