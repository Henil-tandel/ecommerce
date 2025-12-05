import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import productcontentService from '../../services/users/productcontent.service';
import { IRequest } from '../../lib/common.interface';

export default new (class ProductContentController {

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

    // Get product with content
    getProductWithContent = (req: IRequest, res: Response) => {
        try {
            const productId = Number(req.params.product_id)
            productcontentService.getProductWithContent(productId)
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