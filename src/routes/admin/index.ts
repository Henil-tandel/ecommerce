import express from 'express';
import AuthRoutes from './auth.routes';
import ProductRoutes from './product.routes';
import CategoryRoutes from './category.routes';
import ProductcomboRoutes from './productcombo.routes';
import ProductcontentRoutes from './productcontent.routes';
import BannerRoutes from './banner.routes';
import BlogRoutes from './blog.routes';
import ProductVariantRoutes from './productVariant.routes'
const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/product',ProductRoutes);
router.use('/category',CategoryRoutes);
router.use('/combo',ProductcomboRoutes);
router.use('/content',ProductcontentRoutes);
router.use('/banner',BannerRoutes);
router.use('/blog',BlogRoutes);
router.use('/variant',ProductVariantRoutes);

export default router;
