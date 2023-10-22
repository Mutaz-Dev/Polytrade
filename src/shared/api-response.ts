import { IAPIResponse } from "./interfaces/api-respone.interface"


export const apiResponse = (message: string, path: string, res_data?: any, error?: any): IAPIResponse => {
    return {
        status_message: message,
        timestamp: new Date().toISOString(),
        path: path,
        res_data: res_data || null,
    }
}