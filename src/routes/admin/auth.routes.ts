import express from 'express';
import AuthController from '../../controller/admin/auth.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

router.post(
  '/login',
  ValidationMiddleware.validate(ValidationMiddleware.schema.AdminLogin),
  AuthController.login,
);

router.get('/me', AuthGuard.verifyAdminAccessToken, AuthController.me);


export default router;
