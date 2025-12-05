import Wishlist, { IWishlist } from "../../models/wishlist.model";
import Product, { IProduct } from "../../models/product.model";
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class WishlistService {

    // Add product to wishlist
    async addToWishlist(args: Record<string, any>, userId: number) {
        const { product_id } = args;

        // 1️⃣ Validate product existence
        const product = await Product.findOne({ where: { product_id } });
        if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

        // 2️⃣ Check if already exists
        const existing = await Wishlist.findOne({ where: { user_id: userId, product_id } });
        if (existing) Utils.throwError(ErrorMsg.WISHLIST.alreadyExist);

        // 3️⃣ Add to wishlist
        const wishlist = await Wishlist.create({
            user_id: userId,
            product_id,
        });

        // 4️⃣ Retrieve product info for response
        const fullProduct = await Product.findOne({
            where: { product_id },
            attributes: ['product_id', 'name', 'price', 'image_url', 'description'],
        });

        return {
            message: SuccessMsg.WISHLIST.add,
            wishlist: {
                id: wishlist.wishlist_id,
                product: fullProduct,
            },
        };
    }

    // Get all wishlists
async getAllWishlist(userId: number) {
    // Fetch wishlist items along with their related product details
    const wishlists = await Wishlist.findAll({
      where: { user_id: userId },
      attributes: ['wishlist_id', 'user_id'],
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'description', 'price', 'image_url'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!wishlists || wishlists.length === 0) {
      Utils.throwError(ErrorMsg.WISHLIST.empty);
    }

    // Structure the response exactly like your example
    const formatted = wishlists.map((item: any) => ({
      wishlist_id: item.wishlist_id,
      user_id: item.user_id,
      product: item.Product ? {
        product_id: item.Product.product_id,
        name: item.Product.name,
        description: item.Product.description,
        price: item.Product.price,
        image_url: item.Product.image_url,
      } : null,
    }));

    return {
      status: 'success',
      message: SuccessMsg.WISHLIST.get || 'Wishlist details fetched successfully',
      data: { wishlists: formatted },
    };
  }

    // Remove product from wishlist
    async removeFromWishlist(wishlistId: number) {
        const removed = await Wishlist.destroy({ where: { wishlist_id: wishlistId } });
        if (!removed) Utils.throwError(ErrorMsg.WISHLIST.empty);

        return {
            message: SuccessMsg.WISHLIST.delete,
            removed
        }
    }
})();