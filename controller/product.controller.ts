import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";
import CatchAsyncFunction from "../config/CatchAsyncError";
import productModel, {
  ImageInterface,
  ProductInterface,
} from "../model/product.model";
import ErrorHandler from "../config/ErrorHandler";
import { LayoutImage } from "../types";

export const addProduct = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, description, quantity, image } = req.body.data;

      if (!name || !price || !description || !quantity || !image)
        return next(new ErrorHandler("All field are required", 400));

      try {
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          upload_preset: "dev_setup",
          //moderation: "duplicate:0.8",
        });

        const newImage = {
          public_src: myCloud.public_id,
          url: myCloud.secure_url,
          base64: image,
        } as ImageInterface;

        //save to db
        const product = {
          name,
          price,
          description,
          quantity,
          image: newImage,
        };

        const responds = await productModel.create(product);

        res.status(201).json({
          secusss: true,
          data: responds,
        });
      } catch (error: any) {
        return error;
      }
    } catch (error: any) {
      return error;
    }
  }
);

export const getAllProducts = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productModel.find();
      //res.setHeader('Content-Type', 'application/json')
      res.status(200).json({
        data,
      });
    } catch (error) {
      return error;
    }
  }
);

export const getInActiveProducts = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productModel.aggregate([
        {
          $match: {
            quantity: {
              $lt: 1,
            },
          },
        },
        {
          $count: "inActiveProducts",
        },
      ]);
      
      res.status(200).json({
        inActiveProducts: data.length >0  ? data[0].inActiveProducts : 0
      });
    } catch (error) {
      return error;
    }
  }
);
export const getActiveProducts = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await productModel.aggregate([
        {
          $match: {
            quantity: {
              $gt: 0,
            },
          },
        },
        {
          $count: "activeProducts",
        },
      ]);

      res.status(200).json({
        activeProducts:data[0].activeProducts,
      });
    } catch (error) {
      return error;
    }
  }
);

export const setActivateAndDeactive = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isActive } = req.body;
      const id = req.params.id;
      console.log(isActive);

      if (!id) {
        //Bad request
        console.log("Hello");
        return next(new ErrorHandler("All field are required", 400));
      }
      //find and update
      const p = await productModel.findByIdAndUpdate(id, {
        $set: { isActive: !isActive },
      });
      console.log(p);

      res.sendStatus(201);
    } catch (error) {
      return error;
    }
  }
);

export const deleteProduct = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        //Bad request
        return next(new ErrorHandler("All field are required", 400));
      }

      //find and update
      //get product
      const p = await productModel.findByIdAndDelete(id);
      //delete image from cloudinary
      try {
        await cloudinary.v2.uploader.destroy(p?.image.public_src as string);
      } catch (error) {
        console.log(error);
      }

      res.sendStatus(200);
    } catch (error) {
      return error;
    }
  }
);

export const getProductById = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      if (!id) {
        //Bad request
        return next(new ErrorHandler("All field are required", 400));
      }

      //find and update
      //get product
      const p = await productModel.findById(id);
      if (!p) {
        return res.sendStatus(404);
      }

      res.status(200).json(p);
    } catch (error) {
      return error;
    }
  }
);

export const updateProductById = CatchAsyncFunction(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, price, description, quantity, image } = req.body.data;
      const itemId = req.params.id;

      if (!name || !price || !description || !quantity || !itemId) {
        return next(new ErrorHandler("All field are required", 400));
      }

      //Update picture

      //Find the the item in db
      const product = await productModel.findById(itemId);

      if (!product) return new ErrorHandler("Item not found", 404);

      //check of image
      let newImage;

      if (image) {
        try {
          //delete the old image

          cloudinary.v2.uploader.destroy(image.public_src);

          const myCloud = await cloudinary.v2.uploader.upload(image, {
            upload_preset: "dev_setup",
            //moderation: "duplicate:0.8",
          });

          newImage = {
            public_src: myCloud.public_id,
            url: myCloud.secure_url,
            base64: image,
          } as ImageInterface;

          console.log(newImage);
          //save to db
        } catch (error: any) {
          return next(error);
        }
      }
      const newProduct = {
        name,
        price,
        description,
        quantity,
      };
      if (newImage !== undefined) newProduct.image = newImage;
    
      const result = await productModel.findByIdAndUpdate(itemId, {$set: newProduct}, {multi: true,});

      return res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(error);
    }
  }
);
