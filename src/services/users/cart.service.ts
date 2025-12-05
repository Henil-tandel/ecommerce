import Product from '../../models/product.model';
import Cart from '../../models/cart.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class CartService {
  
  // Add or update product in user's cart
  async addToCart(userId: number, productId: number, quantity: number) {
    const product = await Product.findOne({
      where: { product_id: productId, status: 'active' },
      attributes: ['product_id', 'name', 'price', 'image_url', 'stock'],
    });

    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);
    if (product.stock < quantity) Utils.throwError('Not enough stock available');

    const existingItem = await Cart.findOne({ where: { user_id: userId, product_id: productId } });

    let updatedItem;

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) Utils.throwError('Cannot exceed stock limit');
      existingItem.quantity = newQty;
      await existingItem.save();
      updatedItem = existingItem;
    } else {
      updatedItem = await Cart.create({
        user_id: userId,
        product_id: productId,
        quantity,
      });
    }

    // Fetch with product details
    const itemWithProduct = await Cart.findOne({
      where: { cart_id: updatedItem.cart_id },
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['product_id', 'name', 'price', 'image_url', 'stock'],
        },
      ],
    });

    // Calculate total price for this item
    const total_price = Number(itemWithProduct.Product.price) * itemWithProduct.quantity;

    return {
      message: existingItem ? 'Cart updated successfully' : SuccessMsg.CART.add,
      item: {
        ...itemWithProduct.toJSON(),
        total_price,
      },
    };
  }

  // Get all items in user's cart
  async getCartItems(userId: number) {
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['product_id', 'name', 'price', 'image_url', 'stock'],
        },
      ],
    });

    if (!cartItems.length) Utils.throwError('Your cart is empty');

    // Add total_price per item
    const itemsWithTotal = cartItems.map((item) => ({
      ...item.toJSON(),
      total_price: Number(item.Product.price) * item.quantity,
    }));

    // 💰 Calculate grand total
    const total = itemsWithTotal.reduce((acc, item) => acc + item.total_price, 0);

    return {
      message: SuccessMsg.CART.get,
      total,
      items: itemsWithTotal,
    };
  }

  // Update quantity of a cart item
  async updateQuantity(userId: number, productId: number, quantity: number) {
    const cartItem = await Cart.findOne({ where: { user_id: userId, product_id: productId } });
    if (!cartItem) Utils.throwError('Item not found in your cart');

    const product = await Product.findOne({
      where: { product_id: productId },
      attributes: ['product_id', 'name', 'price', 'image_url', 'stock'],
    });
    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

    if (quantity > product.stock) Utils.throwError('Not enough stock available');

    cartItem.quantity = quantity;
    await cartItem.save();

    const itemWithProduct = await Cart.findOne({
      where: { cart_id: cartItem.cart_id },
      include: [
        {
          model: Product,
          as: 'Product',
          attributes: ['product_id', 'name', 'price', 'image_url', 'stock'],
        },
      ],
    });

    // Calculate total price for this item
    const total_price = Number(itemWithProduct.Product.price) * itemWithProduct.quantity;

    return {
      message: 'Quantity updated successfully',
      item: {
        ...itemWithProduct.toJSON(),
        total_price,
      },
    };
  }

  // Remove item from cart
  async removeFromCart(userId: number, productId: number) {
    const item = await Cart.findOne({ where: { user_id: userId, product_id: productId } });
    if (!item) Utils.throwError('Item not found in cart');

    await item.destroy();
    return { message: SuccessMsg.CART.delete };
  }

})();
