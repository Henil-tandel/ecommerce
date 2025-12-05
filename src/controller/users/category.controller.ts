import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import categorysService from '../../services/users/category.service';
import { IRequest } from '../../lib/common.interface';

export default new (class CategoryAdminController {

    // Get all categories
    getAllCategories = (req: Request, res: Response) => {
        try {
            categorysService.getAllCategories()
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

    // Get category by id
    getCategoryById = (req: IRequest, res: Response) => {
        try {
            const categoryId = Number(req.params.category_id);
            categorysService.getCategoryById(categoryId)
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