import express from 'express';
import ProductVariantController from '../../controller/admin/productVariant.controller'
import { upload } from '../../controller/users/userauth.controller';
const router = express.Router();

router.post('/',upload.array('variants',5) ,ProductVariantController.createVariant);
router.get('/', ProductVariantController.getAllVariants);
router.get('/:id', ProductVariantController.getVariantById);
router.put('/:id',upload.array('variants',5), ProductVariantController.updateVariant);
router.delete('/:id', ProductVariantController.deleteVariant);

export default router;
