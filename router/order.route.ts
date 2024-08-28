import express from 'express';
import { createOrder, delOrderById, getAllOrders, getOrderWithProducts, updateTrackingId } from '../controller/order.controller';
const orderRouter = express.Router();


orderRouter.get('/', getAllOrders);
orderRouter.post('/create-order', createOrder)
orderRouter.get('/:id', getOrderWithProducts)
orderRouter.put('/:id', updateTrackingId)
orderRouter.delete('/:id', delOrderById)

export default orderRouter