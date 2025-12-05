import express from 'express';
import AuthRoutes from './userauth.routes';
import AddressRoutes from './useraddress.routes';
import CatergoryRoutes from './category.routes';
import ProductRoutes from './product.routes';
import WishlistRoutes from './wishlist.routes'; 
import CartRoutes from './cart.routes';
import ProductContentRoutes from './productcontent.routes';
import BannerRoutes from './banner.routes';
import BlogRoutes from './blog.routes';
import ReviewRoutes from './review.routes'
import ProductComboRoutes from './productcombo.routes'

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/address',AddressRoutes);
router.use('/category',CatergoryRoutes);
router.use('/product',ProductRoutes);
router.use('/wishlist',WishlistRoutes);
router.use('/cart',CartRoutes);
router.use('/content',ProductContentRoutes);
router.use('/banner',BannerRoutes);
router.use('/blog',BlogRoutes);
router.use('/review',ReviewRoutes);
router.use('/combo',ProductComboRoutes);

export default router;
