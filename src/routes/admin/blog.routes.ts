import express from "express";
import blogController from "../../controller/admin/blog.controller";
import * as AuthGuard from "../../middleware/authGard";
import { upload } from "../../controller/users/userauth.controller";
import validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();

router.post('/',AuthGuard.verifyAdminAccessToken,upload.single('blogs'),
validationMiddleware.validate(validationMiddleware.schema.CreateBlog),
blogController.createBlog);
router.get('/',AuthGuard.verifyAdminAccessToken,blogController.getAllBlogs);
router.get('/:blog_id',AuthGuard.verifyAdminAccessToken,blogController.getBlogById);
router.put('/:blog_id',AuthGuard.verifyAdminAccessToken,upload.single('blogs'),
validationMiddleware.validate(validationMiddleware.schema.UpdateBlog),
blogController.updateBlog);
router.delete('/:blog_id',AuthGuard.verifyAdminAccessToken,blogController.deleteBlog);

export default router;