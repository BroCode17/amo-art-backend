
import mongoose,{Schema, Document} from "mongoose";
import { LayoutCarousel, LayoutImage } from "../types";

export interface ImageSchemaInterface {
    src?: string,
    alt: string;
    tags: Array<string>,
    image: LayoutImage
    createdAt: Date,
    updatedAt: Date,
}

const layoutImageSchame = new Schema<LayoutImage>({
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

const imageSchema = new Schema<ImageSchemaInterface>({
    src: {
        type: String, // The base64 string or URL to the image
      },
      alt: {
        type: String,
        required: true, // Alternative text for the image
      },
      tags: {
        type: [String], // An array of tags like ['Home', 'Banner', 'Products', 'Footer']
        default: [],
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
      image: layoutImageSchame
})

imageSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

const imageModel = mongoose.model('Images', imageSchema);

export default imageModel;
  

