import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import reviewService from "../../services/users/review.service";
import { IRequest } from "../../lib/common.interface";

export default new (class ReviewController {

    // Add a review
    addReview = (req: IRequest, res: Response) => {
        try {
            const productId = Number(req.params.product_id)
            const { rating, comment } = req.body;
            reviewService.addReview({ rating, comment }, productId, req.user.userid)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Get all reviews
    getAllReviews = (req: IRequest, res: Response) => {
        try {
            reviewService.getAllReviews(req.user.userid)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Get reviews by id
    getReviewById = async (req: IRequest, res: Response) => {
        try {
            const reviewId = Number(req.params.review_id)
            reviewService.getReviewById(reviewId)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Update review
    updateReview = (req: IRequest, res: Response) => {
        try {
            const reviewId = Number(req.params.review_id);
            const userId = req.user.userid;
            const { rating, comment } = req.body;
            reviewService.updateReview({ rating, comment }, reviewId, userId)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Delete review
    deleteReview = async (req: IRequest, res: Response) => {
        try {
            const reviewId = Number(req.params.review_id)
            reviewService.deleteReview(reviewId)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }
})