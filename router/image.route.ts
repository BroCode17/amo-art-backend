import express from "express";
import { addImage, deleteImageById, getAllImages, updateImageById, updateImages } from "../controller/layout/image.controller";


const imageRoute = express.Router();

imageRoute.route('/images').get(getAllImages).post(addImage).put(updateImages)
imageRoute.route('/images/:id').put(updateImageById).delete(deleteImageById)

export default imageRoute