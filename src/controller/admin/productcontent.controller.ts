import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import productcontentService from '../../services/admin/productcontent.service';
import { IRequest } from '../../lib/common.interface';

export default new (class ProductContentController {

    // Create product content
    createProductContent = (req: IRequest, res: Response) => {
        try {
            const product_id = Number(req.params.product_id);
            const { description, features, specifications, materials, dimensions, warranty, careInstructions, images } = req.body;
            const args = {
                product_id,
                description,
                features,
                specifications,
                materials,
                dimensions,
                warranty,
                careInstructions,
                images
            }

            productcontentService.createProductContent(args)
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

    // Get all product content
    getAllProductContent = (req: Request, res: Response) => {
        try {
            productcontentService.getAllProductContent()
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

    // Get product content by id
    getProductContentById = (req: IRequest, res: Response) => {
        try {
            const contentId = Number(req.params.content_id);
            productcontentService.getProductContentById(contentId)
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

    // Update a product content
    updateProductContent = (req: IRequest, res: Response) => {
        try {
            const { product_id, description, features, specifications, materials, dimensions, warranty, careInstructions, images } = req.body;
            const args = {
                product_id,
                description,
                features,
                specifications,
                materials,
                dimensions,
                warranty,
                careInstructions,
                images
            }

            productcontentService.updateProductContent(req.params.content_id, args)
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

    // Delete a product content
    deleteProductContent = (req: IRequest, res: Response) => {
        try {
            const contentId = Number(req.params.id);
            productcontentService.deleteProductContent(contentId)
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

    // Get product with content
    getProductWithContent = (req: IRequest, res: Response) => {
        try {

            productcontentService.getProductWithContent(req.params.product_id)
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
})();