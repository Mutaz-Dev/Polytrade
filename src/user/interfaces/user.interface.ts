export interface IUser {
      id: number,
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
  
  
  
  
    