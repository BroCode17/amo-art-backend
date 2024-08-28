import { Response, Request, NextFunction } from "express";
import CatchAsyncFunction from "../config/CatchAsyncError";
import orderModal from "../model/order.model";
import mongoose from "mongoose";
import productModel from "../model/product.model";
import ErrorHandler from "../config/ErrorHandler";

export const getAllOrders = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allOrders = await orderModal
        .find()
        .populate({
          path: "products.product",
          select: "name description price",
        })
        .exec();

      res.status(200).json(allOrders);
    } catch (error) {
      return next(error);
    }
  }
);

export const createOrder = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      /**
         * refrenceNumber: string;
    totalAmount: number;
    customerEmail: string;
    customerShippingInformation: CustomerAddressInterface;
    itemPurchases: OrderProductInterface[];
    orderDate: Date;
    orderStatus: OrderStatus
         */
      const {
        totalAmount,
        customerEmail,
        customerShippingInformation,
        products,
        refrenceNumber,
        itemSize
      } = req.body;

      const orderData = {
        refrenceNumber,
        totalAmount,
        customerEmail,
        customerShippingInformation,
        products,
        itemSize
      };
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        const response = await orderModal.create([orderData], { session });

        for (const orderProduct of orderData.products) {
          const product = await productModel
            .findById(orderProduct.product)
            .session(session);

          if (product.quantity < orderProduct.orderedQuantity) {
            throw new Error(
              `Insufficient quantity for product ${product.name}`
            );
          }

          product.quantity -= orderProduct.orderedQuantity;
          await product.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
      
        res.status(201).json(response);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error creating order:", error);
      }
    } catch (error) {
      return next(error);
    }
  }
);

export const getOrderWithProducts = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    if (orderId.length === 0 || orderId.length < 8 || orderId.length > 8) {
      return next(new ErrorHandler("Enter a valid order reference id", 400));
    }
    const order = await orderModal
      .findOne({ refrenceNumber: orderId })
      .populate({
        path: "products.product",
        select: "name description price image",
      })
      .exec();

 
    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    res.status(200).json(order);
  }
);
export const delOrderById = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    if (orderId.length === 0 || orderId.length < 8 || orderId.length > 8) {
      return next(new ErrorHandler("Enter a valid order reference id", 400));
    }
    const order = await orderModal
      .deleteOne({ refrenceNumber: orderId })
      .exec();


    if (!order) {
      return next(new ErrorHandler("Order not found", 404));
    }
    res.status(201).json({ success: true });
  }
);
export const updateTrackingId = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const {trackingId, shipState} = req.body.data;
    const orderId = req.params.id;
   
    if (orderId.length === 0 || orderId.length < 8 || orderId.length > 8) {
      return next(new ErrorHandler("Enter a valid order reference id", 400));
    }
    try {
      const order = await orderModal
        .findOneAndUpdate(
          { refrenceNumber: orderId },
          { $set: { trackingId, orderStatus: shipState } }
        )
        .exec();

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      res.status(201).json({ success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }
);
