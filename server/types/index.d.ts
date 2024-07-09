import { Document } from "mongoose";
export interface UserInterface extends Document{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    SignAccessToken: () => string;
    RefreshAccessToken: () => string;
    comparePasswrod: (value: string) => boolean
}


export interface RegisterUserInterface {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: any
}

export interface ActivateUserInterface {
    accessToken: string;
    activationCode: string;
}

export interface LoginInterface {
    email: string;
    password: string;
}

export interface CookieTokenOptions {
    expires: Date;
    maxAge: number;
    httpOnly?: boolean;
    sameSite?: "lax" | "strict" | "none" | undefined;
    secure?: boolean;
}
