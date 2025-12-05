import express from 'express';
import reviewController from '../../controller/users/review.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post('/:product_id',AuthGuard.verifyUserAccessToken,reviewController.addReview);
router.get('/',AuthGuard.verifyUserAccessToken,reviewController.getAllReviews);
router.get('/:review_id',AuthGuard.verifyUserAccessToken,reviewController.getReviewById);
router.put('/:review_id',AuthGuard.verifyUserAccessToken,reviewController.updateReview);
router.delete('/:review_id',AuthGuard.verifyUserAccessToken,reviewController.deleteReview);

export default router;