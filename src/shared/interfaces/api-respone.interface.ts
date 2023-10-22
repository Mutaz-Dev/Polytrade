
// TODO: CREATE A DYNAMIC RESPONSE
export interface IAPIResponse {
    status_message: string;
    timestamp: string;
    path: string;
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