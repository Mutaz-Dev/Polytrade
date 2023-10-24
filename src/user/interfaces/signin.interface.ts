import { IUser } from "../../user/interfaces/user.interface";

export interface ISignIn {
    user: IUser,
    token: string,
};