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

export interface UpdateUserInfo {
   // name: string;
    email: string;
    password: string;
    oldPassword: string;
}



// Home Page
export interface LayoutImage  extends Document{
    public_src: string;
    url: string;
}

export interface LayoutCarousel  extends Document{
    name: string;
    alt?: string;
    image: LayoutImage
}

export interface TestimoialsInterface extends Document {
    name: string;
    subtext: string;
    description: string;
    date?: Date;
    image: LayoutCarousel;
}
export interface HomepageLayoutInterface extends Document {
    type: string
    banner: Array<LayoutImage>;
    carosel: Array<LayoutCarousel>;
    calbackImage: LayoutImage;
    testimonials: {
        title: string;
        test: Array<TestimoialsInterface>;
        video: {
            url: string
        }
    }

}


