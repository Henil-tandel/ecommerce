import express from 'express';
import productcontentController from '../../controller/users/productcontent.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.get('/:id',AuthGuard.verifyUserAccessToken,productcontentController.getProductContentById);
router.get('/product/:product_id',AuthGuard.verifyUserAccessToken,productcontentController.getProductWithContent);

export default router;