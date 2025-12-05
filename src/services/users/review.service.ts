import Review, { IReview } from '../../models/review.model';
import Product from '../../models/product.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import { io } from '../../server';

export default new (class ReviewService {

  // Helper: Update average rating of a product
  async updateProductRating(productId: number) {
    const allReviews = await Review.findAll({ where: { product_id: productId } });

    if (allReviews.length === 0) {
      await Product.update({ ratings: 0 }, { where: { product_id: productId } });
      return;
    }

    const total = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = total / allReviews.length;

    await Product.update({ ratings: avgRating }, { where: { product_id: productId } });
  }

  // Add a review
  async addReview(args: Record<string, any>, productId: number, userId: number) {
    const { rating, comment } = args;

    if (rating < 1 || rating > 5) Utils.throwError('Rating must be between 1 and 5.');

    const product = await Product.findOne({ where: { product_id: productId } });
    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

    const review: IReview = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      comment,
    });

    // Update product average rating
    await this.updateProductRating(productId);

    const fullReview = await Review.findOne({
      where: { review_id: (review as any).review_id },
      include: [{ model: Product, as: 'product' }],
    });

    io.of('/admin').emit('add_review',{
      product_id: product.product_id,
      name: product.name,
      rating: fullReview.rating
    });

    return {
      message: SuccessMsg.REVIEW.add,
      review: fullReview,
    };
  }

  // Get all reviews for a user
  async getAllReviews(userId: number) {
    const reviews = await Review.findAll({
      where: { user_id: userId },
      include: [{ model: Product, as: 'product' }],
    });
    if (!reviews || reviews.length === 0)
      Utils.throwError(ErrorMsg.REVIEW.notFound);

    return {
      message: SuccessMsg.REVIEW.get,
      reviews,
    };
  }

  // Get single review
  async getReviewById(reviewId: number) {
    const review = await Review.findOne({
      where: { review_id: reviewId },
      include: [{ model: Product, as: 'product' }],
    });
    if (!review) Utils.throwError(ErrorMsg.REVIEW.notFound);

    return {
      message: SuccessMsg.REVIEW.get,
      review,
    };
  }

  // Update review & product rating
  async updateReview(args: Record<string, any>, reviewId: number, userId: number) {
    const review = await Review.findOne({
      where: { review_id: reviewId, user_id: userId },
    });
    if (!review) Utils.throwError(ErrorMsg.REVIEW.notFound);

    if (args.rating && (args.rating < 1 || args.rating > 5))
      Utils.throwError('Rating must be between 1 and 5.');

    await review.update({ ...args });

    await this.updateProductRating(review.product_id);

    const updated = await Review.findOne({
      where: { review_id: reviewId },
      include: [{ model: Product, as: 'product' }],
    });

    return {
      message: SuccessMsg.REVIEW.update,
      review: updated,
    };
  }

  // Delete review & update product rating
  async deleteReview(reviewId: number) {
    const review = await Review.findOne({ where: { review_id: reviewId } });
    if (!review) Utils.throwError(ErrorMsg.REVIEW.notFound);

    const productId = review.product_id;

    await review.destroy();

    await this.updateProductRating(productId);

    return {
      message: SuccessMsg.REVIEW.delete,
    };
  }
})();
