import { UserInterface } from '../types';
import { Request } from "express";


declare global{
    namespace Express{
        interface Request{
            user?: UserInterface
        }
    }
}