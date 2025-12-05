import express from "express";
import bannerController from "../../controller/users/banner.controller";
import * as AuthGuard from "../../middleware/authGard";

const router = express.Router();

router.get('/',AuthGuard.verifyAdminAccessToken,bannerController.getAllBanners);
router.get('/:banner_id',AuthGuard.verifyAdminAccessToken,bannerController.getBannerById);

export default router;