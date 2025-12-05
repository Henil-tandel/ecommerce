import express from "express";
import categoryController from "../../controller/admin/category.controller";
import * as AuthGuard from "../../middleware/authGard";
import { upload } from "../../controller/users/userauth.controller";
import validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();

router.post(
  "/",
  AuthGuard.verifyAdminAccessToken,
  upload.single("category"),
  validationMiddleware.validate(validationMiddleware.schema.CreateCategory),
  categoryController.addCategory
);
router.get("/", AuthGuard.verifyAdminAccessToken, categoryController.getAllCategories);
router.get("/:category_id", AuthGuard.verifyAdminAccessToken, categoryController.getCategoryById);
router.put(
  "/:category_id",
  AuthGuard.verifyAdminAccessToken,
  upload.single("category"),
  validationMiddleware.validate(validationMiddleware.schema.UpdateCategory),
  categoryController.updateCategory
);
router.delete("/:category_id", AuthGuard.verifyAdminAccessToken, categoryController.deleteCategory);

export default router;
