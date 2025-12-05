import express from 'express';
import categoryController from '../../controller/users/category.controller';
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

router.get('/',AuthGuard.verifyUserAccessToken,categoryController.getAllCategories);
router.get('/:category_id',AuthGuard.verifyUserAccessToken,categoryController.getCategoryById);

export default router;