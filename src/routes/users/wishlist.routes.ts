import express from 'express';
import wishlistController from '../../controller/users/wishlist.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post('/:product_id',AuthGuard.verifyUserAccessToken,wishlistController.addToWishlist);
router.get('/',AuthGuard.verifyUserAccessToken,wishlistController.getAllWishlists);
router.delete('/:wishlist_id',AuthGuard.verifyUserAccessToken,wishlistController.removeFromWishlist);

export default router;