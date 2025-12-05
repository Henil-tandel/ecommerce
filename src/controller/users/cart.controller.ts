import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import cartService from "../../services/users/cart.service";
import { IRequest } from "../../lib/common.interface";

export default new (class CartController {
  // Add to cart
  addToCart = (req: IRequest, res: Response): void => {
    try {
      const userId = req.user?.userid;
      const productId = Number(req.params.product_id);
      const { quantity } = req.body; // quantity comes from frontend

      if (!userId || !productId)
        throw new Error("User ID or Product ID missing");

      cartService
        .addToCart(userId, productId, Number(quantity) || 1)
        .then((result) => {
          res
            .status(Utils.statusCode.OK)
            .send(Utils.sendSuccessResponse(result));
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
  };

  // Get all cart items for the logged-in user
  getCartItems = (req: IRequest, res: Response): void => {
    try {
      const userId = req.user?.userid;
      if (!userId) throw new Error("User ID missing");

      cartService
        .getCartItems(userId)
        .then((result) => {
          res
            .status(Utils.statusCode.OK)
            .send(Utils.sendSuccessResponse(result));
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
  };

  // Update quantity of a specific item
  updateQuantity = (req: IRequest, res: Response): void => {
    try {
      const userId = req.user?.userid;
      const productId = Number(req.params.product_id);
      const { quantity } = req.body;

      if (!userId || !productId || !quantity)
        throw new Error("Missing required fields");

      cartService
        .updateQuantity(userId, productId, Number(quantity))
        .then((result) => {
          res
            .status(Utils.statusCode.OK)
            .send(Utils.sendSuccessResponse(result));
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
  };

  // Remove item from cart
  removeFromCart = (req: IRequest, res: Response): void => {
    try {
      const userId = req.user?.userid;
      const productId = Number(req.params.product_id);

      if (!userId || !productId) throw new Error("Missing required fields");

      cartService
        .removeFromCart(userId, productId)
        .then((result) => {
          res
            .status(Utils.statusCode.OK)
            .send(Utils.sendSuccessResponse(result));
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
  };

})();
