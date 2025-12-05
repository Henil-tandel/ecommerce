import express from "express";
import bannerController from "../../controller/admin/banner.controller";
import * as AuthGuard from "../../middleware/authGard";
import { upload } from "../../controller/users/userauth.controller";
import validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();

router.post('/',AuthGuard.verifyAdminAccessToken,
  upload.fields([
    { name: 'desktop', maxCount: 1 },
    { name: 'mobile', maxCount: 1 },
  ]),
  validationMiddleware.validate(validationMiddleware.schema.CreateBanner),
  bannerController.addBanner
);
router.get('/',AuthGuard.verifyAdminAccessToken,bannerController.getAllBanners);
router.get('/:banner_id',AuthGuard.verifyAdminAccessToken,bannerController.getBannerById);
router.put(
  '/:banner_id',
  AuthGuard.verifyAdminAccessToken,
  upload.fields([
    { name: 'desktop', maxCount: 1 },
    { name: 'mobile', maxCount: 1 },
  ]),
  validationMiddleware.validate(validationMiddleware.schema.UpdateBanner),
  bannerController.updateBanner
);
router.delete('/:banner_id',AuthGuard.verifyAdminAccessToken,bannerController.deleteBanner);

export default router;
