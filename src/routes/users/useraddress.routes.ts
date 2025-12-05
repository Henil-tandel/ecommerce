import express from 'express';
import AddressController from '../../controller/users/useraddress.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';
const router = express.Router();

router.post(
  '/',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserAddress),
  AddressController.addAddress,
);


router.get('/default',AuthGuard.verifyUserAccessToken,AddressController.getDefaultAddress);
router.get('/', AuthGuard.verifyUserAccessToken, AddressController.viewAllAddress);

router.patch(
  '/:address_id',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserAddress),
  AddressController.updateAddress,
);

router.delete(
  '/:address_id',
  AuthGuard.verifyUserAccessToken,
  AddressController.deleteAddress,
);

export default router;
