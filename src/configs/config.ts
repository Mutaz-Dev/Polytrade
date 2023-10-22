import * as dotenv from 'dotenv';
dotenv.config({path: __dirname + '/.env'});


// export const APP_STAGE = process.env.APP_STAGE as string;
export const SERVER_PORT = (process.env.SERVER_PORT as any) as number;