import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import productVariantService from '../../services/admin/productVariant.service';
import { IRequest } from '../../lib/common.interface';

export default new (class ProductVariantController {
    // Create a new product variant
    createVariant = (req: IRequest, res: Response) => {
        try {
            const args = req.body
            const files = Array.isArray(req.files)
                ? (req.files as Express.Multer.File[])
                : (req.files?.images || []) as Express.Multer.File[];

            productVariantService
                .createVariant(args,files)
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


    // Get all product variants
    getAllVariants = (req: Request, res: Response) => {
        try {
            productVariantService
                .getAllVariants()
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

    // Get variant by ID
    getVariantById = (req: Request, res: Response) => {
        try {
            const variantId = Number(req.params.id);

            productVariantService
                .getVariantById(variantId)
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

    // Update variant
    updateVariant = (req: Request, res: Response) => {
        try {
            const variantId = Number(req.params.id);
            const { label, stock, quantity, variantSKU, images, pricing } = req.body;
            const args = { label, stock, quantity, variantSKU, images, pricing };

            productVariantService
                .updateVariant(variantId, args)
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

    // Delete variant
    deleteVariant = (req: IRequest, res: Response) => {
        try {
            const variantId = Number(req.params.id);

            productVariantService
                .deleteVariant(variantId)
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
