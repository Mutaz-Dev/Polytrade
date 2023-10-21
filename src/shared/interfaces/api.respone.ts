// import { APIResponse } from "../interfaces/api-response"

// TODO: REMOVE THIS IF NOT NEEDED
// export const apiResponse = (code: number, message: string, res_data?: any, error?: any): APIResponse => {
//     return {
//         state_code: code || 0,
//         state_message: message,
//         res_data: res_data || null,
//     }
// }


export interface IAPIResponse {
    status_message: string;
    res_data?: any;
}


type StatusResponse = {
    status: number;
    isValid: boolean;
};


// TODO: REMOVE THIS IF NOT NEEDED
type User = {
name: string;
};

type GetUserResponse = {
user: User;
};

export type ApiGetUserResponse = StatusResponse & GetUserResponse;