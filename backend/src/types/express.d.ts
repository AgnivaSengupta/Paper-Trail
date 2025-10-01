import { IUser } from "./User"; // adjust path
import 'express-serve-static-core';
import 'express';

declare module 'express' {
    interface Request {
        user?: IUser;
    }
}