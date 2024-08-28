import mongoose, {Document, Model} from "mongoose";


export interface ImageInterface {
    public_src: string;
    url: string;
    base64: string;
}



export interface Variant {
    name:string;
    price:number;
}



export interface ProductInterface {
    name: string;
    description: string;
    quantity: number;
    variants: Array<{name: string, price: number}>,
    image: ImageInterface,
    isActive: boolean, 
    
}

const varaintSchema = new mongoose.Schema<Variant>({
    name: {
        type: String,
        required:[true, 'Proudct name is required'],
    },
    price: {
        type: Number,
        required: [true, 'Product price is requrid']
    }
})



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
    variants: [{
        name: {
            type: String,
            required:[true, 'Proudct name is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is requrid']
        }
    }],
    image: {
        public_src: String,
        url: String,
    },
    isActive: {
        type: Boolean,
        default: false
    },
   
})

const productModel = mongoose.model("Product", productSchema)

export default productModel