// import { APIResponse } from "../interfaces/api-response"

// export const apiResponse = (code: number, message: string, res_data?: any, error?: any): APIResponse => {
//     return {
//         state_code: code || 0,
//         state_message: message,
//         res_data: res_data || null,
//     }
// }


export interface APIResponse {
    status_message: string;
    res_data?: any;
}


type StatusResponse = {
    status: number;
    isValid: boolean;
};

type User = {
name: string;
};

type GetUserResponse = {
user: User;
};

export type ApiGetUserResponse = StatusResponse & GetUserResponse;