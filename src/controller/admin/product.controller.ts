// src/controllers/admin/product.controller.ts
import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import productAdminService from '../../services/admin/product.service';
import { IRequest } from '../../lib/common.interface';

export default new (class ProductAdminController {
  // Create Product
  createProduct = (req: IRequest, res: Response) => {
    try {
      const args = req.body;
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files?.images || []) as Express.Multer.File[];

      productAdminService
        .createProduct(args, files)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Get All Products
  getAllProducts = (req: IRequest, res: Response) => {
    try {
      const filters = req.query
      productAdminService
        .getAllProducts(filters)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Export Products CSV (with filters)
  exportProductsCSV = (req: IRequest, res: Response) => {
    try {
      const filters = req.query;

      productAdminService
        .generateProductCSV(filters)
        .then((csvBuffer) => {
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=products.csv"
          );

          res.status(200).send(csvBuffer);
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err: any) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };


  // Get Product by ID
  getProductById = (req: IRequest, res: Response) => {
    try {
      const productId = Number(req.params.product_id);

      productAdminService
        .getProductById(productId)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Update Product
  updateProduct = (req: IRequest, res: Response) => {
    try {
      const productId = Number(req.params.product_id);
      const args = req.body;
      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files?.images || []) as Express.Multer.File[];

      productAdminService
        .updateProduct(productId, args, files)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Delete Product (Hard Delete)
  deleteProduct = (req: IRequest, res: Response) => {
    try {
      const productId = Number(req.params.product_id);

      productAdminService
        .deleteProduct(productId)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err: any) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
