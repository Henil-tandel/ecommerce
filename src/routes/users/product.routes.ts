import express from 'express';
import productController from '../../controller/users/product.controller'
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

router.get('/',AuthGuard.verifyUserAccessToken,productController.getAllProducts);
router.get('/:product_id',AuthGuard.verifyUserAccessToken,productController.getProductById);
router.get('/export/csv', AuthGuard.verifyUserAccessToken, productController.exportProductsCSV);
router.get('/:category_id/category',AuthGuard.verifyUserAccessToken,productController.getProductByCategory);

export default router;