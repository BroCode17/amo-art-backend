import { getBanners } from './../controller/layout/homepage';
import express from "express";
import { addBannerImage, deleteBanner, updateCarouselBackImage } from "../controller/layout/homepage";

const homeRoute = express.Router();

homeRoute.route('/banner').get(getBanners).post( addBannerImage).delete(deleteBanner)
homeRoute.put('/update-cal-back-image', updateCarouselBackImage)


export default homeRoute