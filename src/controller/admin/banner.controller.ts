import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import bannerService from "../../services/admin/banner.service";
import { IRequest } from "../../lib/common.interface";

export default new (class BannerAdminController {
  // Add banner
  addBanner = async (req: IRequest, res: Response) => {
    try {
      const { title, subtitle, description } = req.body;

      // Expecting two files: desktop & mobile
      const files = {
        desktop: Array.isArray(req.files?.desktop)
          ? req.files.desktop[0]
          : undefined,
        mobile: Array.isArray(req.files?.mobile)
          ? req.files.mobile[0]
          : undefined,
      };

      const result = await bannerService.addBanner(
        { title, subtitle, description },
        files
      );

      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Get all banners
  getAllBanners = async (req: Request, res: Response) => {
    try {
      const result = await bannerService.getAllBanners();
      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Get banner by id
  getBannerById = async (req: IRequest, res: Response) => {
    try {
      const bannerId = Number(req.params.banner_id);
      const result = await bannerService.getBannerById(bannerId);
      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Update banner
  updateBanner = async (req: IRequest, res: Response) => {
    try {
      const { title, subtitle, description } = req.body;
      const bannerId = Number(req.params.banner_id);

      const files = {
        desktop: Array.isArray(req.files?.desktop)
          ? req.files.desktop[0]
          : undefined,
        mobile: Array.isArray(req.files?.mobile)
          ? req.files.mobile[0]
          : undefined,
      };

      const result = await bannerService.updateBanner(
        { title, subtitle, description },
        bannerId,
        files
      );

      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Delete banner
  deleteBanner = async (req: IRequest, res: Response) => {
    try {
      const bannerId = Number(req.params.banner_id);
      const result = await bannerService.deleteBanner(bannerId);

      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
})();
