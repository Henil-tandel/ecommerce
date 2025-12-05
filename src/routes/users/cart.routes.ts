import express from 'express';
import cartController from '../../controller/users/cart.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post('/:product_id',AuthGuard.verifyUserAccessToken,cartController.addToCart);
router.get('/',AuthGuard.verifyUserAccessToken,cartController.getCartItems);

export default router;