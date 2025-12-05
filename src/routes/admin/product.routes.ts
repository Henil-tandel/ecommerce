import express from 'express';
import productController from '../../controller/admin/product.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
import { upload } from '../../controller/users/userauth.controller';
import validationMiddleware from '../../middleware/validation.middleware';

const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyAdminAccessToken,
  upload.array('product', 5),
  validationMiddleware.validate(validationMiddleware.schema.CreateProduct),
  productController.createProduct,
);

router.get('/', AuthGuard.verifyAdminAccessToken, productController.getAllProducts);
router.get('/export/csv', productController.exportProductsCSV);
router.get('/:product_id', AuthGuard.verifyAdminAccessToken, productController.getProductById);

router.put(
  '/:product_id',
  AuthGuard.verifyAdminAccessToken,
  upload.array('product', 5),
  validationMiddleware.validate(validationMiddleware.schema.UpdateProduct),
  productController.updateProduct,
);

router.delete('/:product_id', AuthGuard.verifyAdminAccessToken, productController.deleteProduct);

export default router;
