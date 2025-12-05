import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import wishlistService from '../../services/users/wishlist.service';
import { IRequest } from '../../lib/common.interface';

export default new (class WishlistController {

    // Add to wishlist
    addToWishlist = (req: IRequest, res: Response) => {
        try {
            const product_id = Number(req.params.product_id);
            const userId = req.user.userid;
            wishlistService.addToWishlist({ product_id }, userId)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) =>
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
                );
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Get all wishlists
    getAllWishlists = (req: IRequest, res: Response) => {
        try {
            const userId = req.user.userid
            wishlistService.getAllWishlist(userId)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) =>
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
                );
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Remove from wishlist
    removeFromWishlist = (req: IRequest, res: Response) => {
        try {
            const wishlistId = Number(req.params.wishlist_id)
            wishlistService.removeFromWishlist(wishlistId)
                .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
                .catch((err) =>
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
                );
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }
})