import cloudinary from "cloudinary";
import { NextFunction, Response, Request } from "express";
import CatchAsyncFunction from "../../config/CatchAsyncError";
import ErrorHandler from "../../config/ErrorHandler";
import imageModel from "../../model/image.model";
import { LayoutImage } from "../../types";
import mongoose from "mongoose";

export const addImage = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const { src, alt, tags } = req.body;

    if (!src || !alt) {
      return next(new ErrorHandler("Please, upload an image", 400));
    }

    //Search db to find image
    const image = await imageModel.findOne({ alt });


    if (image) {
      return next(new ErrorHandler("Duplicate Images are not allowed", 403));
    }

    //upload to cloudinary
    try {
      // The DB document might be alread create show we have to update by create new banner
      const myCloud = await cloudinary.v2.uploader.upload(src, {
        upload_preset: "dev_setup",
        //moderation: "duplicate:0.8",
      });

      //create new banner
      const newBanner = {
        public_src: myCloud.public_id,
        url: myCloud.secure_url,
      } as LayoutImage;
      //save to db;
      await imageModel.create({
        tags,
        alt,
        image: newBanner,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Image has been successfully inserted",
        });
    } catch (error) {
      return next(
        new ErrorHandler("Image has been successfully inserted", 500)
      );
    }
  }
);
export const getAllImages = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await imageModel.find();
      res.status(200).json({ success: true, response });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const deleteImageById = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const imageId = req.params.id;

    if (!imageId) {
      //Bad request
      return next(new ErrorHandler("Image can not be deleted!", 400));
    }
    try {
      //get the element from db
      const getImage = await imageModel.findById(imageId);

      if (!getImage) {
        return next(new ErrorHandler("File dost not exist", 404));
      }

      //  //Delete image from cloudinary
      const public_id = getImage?.image.public_src;
      await cloudinary.v2.uploader.destroy(public_id!);

      //delete image from db
      await imageModel.findByIdAndDelete(imageId);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }

    return res.status(201).json({
      success: true,
      message: "File has been deleted successfully",
    });
  }
);

export const updateImageById = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const imageId = req.params.id;
    const { tags } = req.body;
  

    if (!imageId) {
      //Bad request
      return next(new ErrorHandler("Image can not be updated!", 400));
    }
    try {
      //get the element from db
      const getImage = await imageModel.findById(imageId);

      if (!getImage) {
        return next(new ErrorHandler("File dost not exist", 404));
      }

      //update image in db
      await imageModel.findByIdAndUpdate(imageId, { $set: { tags } });
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }

    return res.status(201).json({
      success: true,
      message: "File has been deleted successfully",
    });
  }
);
export const updateImages = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedImages = req.body;

    //start session for bulk operation
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const bulkOps = updatedImages.map(
        (updatedImage: { _id: string; tags: [string] }) => ({
          updateOne: {
            filter: { _id: updatedImage._id },
            update: { $set: {tags: updatedImage.tags} },
          },
        })
      );

      await imageModel.bulkWrite(bulkOps, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(200).json({ message: "Images updated successfully!" });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      res.status(500).json({ error: "Failed to update images" });
    }
  }
);
