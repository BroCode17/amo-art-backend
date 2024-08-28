import { UserInterface } from './../types/index.d';
import mongoose, {Schema, Document, Types} from "mongoose";
import { ProductInterface, productSchema } from './product.model';


export enum OrderStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled',
}

interface CustomerAddressInterface {
    firstName: string;
    lastName: string;
    address: string;
    zipCode: string;
    aptNumber: string,
    city: string,
    state: string
    
}


export interface OrderProductInterface {
    product: Types.ObjectId;
    orderedQuantity: number;
    itemSize: string;
}


export interface OrderInterface {
    refrenceNumber: string;
    totalAmount: number;
    customerEmail: string;
    customerShippingInformation: CustomerAddressInterface;
    products: OrderProductInterface[];
    orderDate: Date;
    orderStatus: OrderStatus,
    trackingId: string;
}

const orderProductSchema = new Schema<OrderProductInterface>({
    product:{
        type: Schema.Types.ObjectId, ref: 'Product',
        required: true
    },
    orderedQuantity: {
        type: Number,
        required: true
    },
    itemSize: {
        type: String,
        default: "Original"
    }

})

const shippingSchema = new Schema<CustomerAddressInterface>({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"]
    },
    address: {
        type: String,
        required: [true, "Address required"]
    },
    zipCode: {
        type: String,
        required: [true, "Last name is required"],
        maxlength: [5, "Zip code must be 5 characters"]
    },
    aptNumber: String,
    city: {
        type: String,
        required: [true, "City is required"]
    },
    state: {
        type: String,
        required: [true, "State is required"]
    }


})

const orderSchema = new Schema<OrderInterface>({
    refrenceNumber: {
        type: String,
        required: [true, "Reference Number is requried"],
        unique: true
    },
    totalAmount: {
        type: Number,
        required: [true, "Total Amount is invalid"]
    },
    customerEmail: {
        type: String,
        required: [true, "Email is required"]
    },
    customerShippingInformation: shippingSchema,
    orderStatus: {
        type: String,
        enum: OrderStatus,
        default: OrderStatus.PENDING
    },
    products: [orderProductSchema],
    orderDate: {
        type: Date,
        default: Date.now
    },
    trackingId: {
        type: String,
        default: ""
    }
    
})


const orderModal = mongoose.model('Order', orderSchema)

export default orderModal