import { Response } from 'express';
import * as Utils from '../../lib/utils';
import productService from '../../services/users/product.service';
import { IRequest } from '../../lib/common.interface';

export default new (class ProductAdminController {

    // Get product by id
    getProductById = (req: IRequest, res: Response): void => {
        try {
            const productId = Number(req.params.product_id)
            productService.getProductById(productId)
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
    }

    // Get all products
    getAllProducts = (req: IRequest, res: Response): void => {
        try {
            const pagination: Record<string, any> = {
                page: req.params.page,
                limit: req.params.limit
            }
            productService.getAllProducts(pagination)
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
    }

    // Get products by category
    getProductByCategory = (req: IRequest, res: Response): void => {
        try {
            const pagination: Record<string, any> = {
                page: req.params.page,
                limit: req.params.limit
            }
            const categoryId = Number(req.params.category_id)
            productService.getProductByCategory(pagination,categoryId)
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
    }

    exportProductsCSV = (req: IRequest, res: Response) => {
        try {
            const filters = req.query;

            productService
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

})();