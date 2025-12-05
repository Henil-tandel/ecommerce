import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import categoryService from "../../services/admin/categorys.service";
import { IRequest } from "../../lib/common.interface";

export default new (class CategoryAdminController {
  // ✅ Create a category (with image upload)
  addCategory = (req: IRequest, res: Response) => {
    try {
      const { name } = req.body;
      const file = req.file;

      categoryService
        .createCategory({ name }, file)
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

  // ✅ Get all categories
  getAllCategories = (req: Request, res: Response) => {
    try {
      categoryService
        .getAllCategories()
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

  // ✅ Get category by ID
  getCategoryById = (req: IRequest, res: Response) => {
    try {
      const categoryId = Number(req.params.category_id);
      categoryService
        .getCategoryById(categoryId)
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

  // ✅ Update category (with optional image)
  updateCategory = (req: IRequest, res: Response) => {
    try {
      const { name } = req.body;
      const categoryId = Number(req.params.category_id);
      const file = req.file;

      categoryService
        .updateCategory({ name }, categoryId, file)
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

  // ✅ Delete category (and image)
  deleteCategory = (req: IRequest, res: Response) => {
    try {
      const categoryId = Number(req.params.category_id);
      categoryService
        .deleteCategory(categoryId)
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
})();
