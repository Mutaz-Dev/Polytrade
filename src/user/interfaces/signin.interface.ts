import { IUser } from "@src/user/interfaces/user.interface";

export interface ISignIn {
    user: IUser;
    token: string;
};