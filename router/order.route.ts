import express from 'express';
import { addOrder, delOrderById, getAllOrders, getOrderWithProducts, updateTrackingId } from '../controller/order.controller';
const orderRouter = express.Router();


orderRouter.get('/', getAllOrders);
orderRouter.post('/create-order', addOrder)
orderRouter.get('/:id', getOrderWithProducts)
orderRouter.put('/:id', updateTrackingId)
orderRouter.delete('/:id', delOrderById)

export default orderRouter