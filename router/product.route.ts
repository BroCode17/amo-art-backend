import express from 'express';
import { addProduct, deleteProduct, getActiveProducts, getAllProducts, getInActiveProducts, getProductById, setActivateAndDeactive, updateProductById } from '../controller/product.controller';
const productRoute = express.Router();

productRoute.post('/add', addProduct);
productRoute.get('/all', getAllProducts)
productRoute.get('/active', getActiveProducts)
productRoute.get('/inactive', getInActiveProducts)
productRoute.delete('/delete/:id', deleteProduct)
productRoute.put('/activate/:id', setActivateAndDeactive)
productRoute.get('/product/:id', getProductById)
productRoute.put('/product/:id', updateProductById)

export default productRoute
