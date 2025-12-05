import express from 'express';
import productcontentController from '../../controller/admin/productcontent.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post('/:product_id',AuthGuard.verifyAdminAccessToken,productcontentController.createProductContent);
router.get('/',AuthGuard.verifyAdminAccessToken,productcontentController.getAllProductContent);
router.get('/:id',AuthGuard.verifyAdminAccessToken,productcontentController.getProductContentById);
router.put('/:id',AuthGuard.verifyAdminAccessToken,productcontentController.updateProductContent);
router.delete('/:id',AuthGuard.verifyAdminAccessToken,productcontentController.deleteProductContent);
router.get('/product/:product_id',AuthGuard.verifyAdminAccessToken,productcontentController.getProductWithContent);

export default router;