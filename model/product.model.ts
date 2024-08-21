import mongoose, {Document, Model} from "mongoose";


export interface ImageInterface {
    public_src: string;
    url: string;
    base64: string;
}





export interface ProductInterface {
    name: string;
    description: string;
    quantity: number;
    price: number
    image: ImageInterface,
    isActive: boolean, 
    
}


export const productSchema = new mongoose.Schema<ProductInterface>({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    description: {
        type: String,
        required: [true,"Description is required"]
    },
    quantity: {
        type: Number,
        required: [true,"Quantity must be at least 1"],
    },
    price: {
        type: Number,
        required: [true,"Price is required. Product is not for free"],
    },
    image: {
        public_src: String,
        url: String,
        base64: String,
    },
    isActive: {
        type: Boolean,
        default: false
    },
   
})

const productModel = mongoose.model("Product", productSchema)

export default productModel