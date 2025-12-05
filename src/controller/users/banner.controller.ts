import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import bannerService from "../../services/users/banner.service";
import { IRequest } from "../../lib/common.interface";

export default new (class BannerAdminController {

    // Get all banners
    getAllBanners = (req: Request, res: Response) => {
        try {
            bannerService.getAllBanners()
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

    // Get banner by id
    getBannerById = (req: IRequest, res: Response): void => {
        try {
            const bannerId = Number(req.params.banner_id);
            bannerService
                .getBannerById(bannerId)
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

})