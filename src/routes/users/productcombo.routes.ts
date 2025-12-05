import express from 'express';
import { productComboController } from '../../controller/users/productcombo.controller';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.get('/',AuthGuard.verifyUserAccessToken,productComboController.getAllCombos);
router.get('/:id',AuthGuard.verifyUserAccessToken,productComboController.getComboById);

export default router;
