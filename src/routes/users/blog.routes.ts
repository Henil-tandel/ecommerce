import express from "express";
import blogController from "../../controller/users/blog.controller";
import * as AuthGuard from "../../middleware/authGard";
import { upload } from "../../controller/users/userauth.controller";

const router = express.Router();

router.get('/',AuthGuard.verifyAdminAccessToken,blogController.getAllBlogs);
router.get('/:blog_id',AuthGuard.verifyAdminAccessToken,blogController.getBlogById);

export default router;