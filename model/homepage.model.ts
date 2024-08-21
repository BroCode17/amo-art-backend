import { HomepageLayoutInterface, LayoutCarousel, LayoutImage, TestimoialsInterface } from "./../types/index.d";
import mongoose, { Model, Schema } from "mongoose";

export const layoutImageSchame = new Schema<LayoutImage>({
    public_src: {
        type: 'String',
        default: '',
    },
    url: {
        type: 'String',
        default: '',
    },
})

export const caroselSchema = new Schema<LayoutCarousel>({
    name: String,
    image: layoutImageSchame,
    alt: String,
})

export const testimonialSchema = new Schema<TestimoialsInterface>({
    name: String,
    description: String,
    subtext: String,
    image: layoutImageSchame
  
}, {timestamps: true})

export const homepageSchame = new Schema<HomepageLayoutInterface>({
    type: {type: String},
    banner: [layoutImageSchame],
    carosel: [{caroselSchema}],
    calbackImage: layoutImageSchame,
    testimonials: {
        title: String,
        test: [{testimonialSchema}],
        video: {
            url: String,
        }
    }
}, {timestamps: true});

const homepageModel = mongoose.model<HomepageLayoutInterface>('Homepage', homepageSchame);

export default homepageModel;
