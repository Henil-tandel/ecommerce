import express from 'express';
import AuthController, { upload } from '../../controller/users/userauth.controller';
import ValidationMiddleware from '../../middleware/validation.middleware';
import * as AuthGuard from '../../middleware/authGard';

const router = express.Router();

// ---------- AUTH ROUTES ----------

// Register (with optional profile picture upload)
router.post(
  '/register',
  upload.single('avatar'),
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserRegister),
  AuthController.userRegister
);

// Login
router.post(
  '/login',
  ValidationMiddleware.validate(ValidationMiddleware.schema.UserLogin),
  AuthController.login
);

// Fetch logged-in user profile
router.get('/me', AuthGuard.verifyUserAccessToken, AuthController.me);

// ---------- PROFILE PICTURE CRUD ----------

// Upload profile picture
router.post(
  '/profile-picture',
  AuthGuard.verifyUserAccessToken,
  upload.single('avatar'),
  AuthController.uploadProfilePicture
);

// Get profile picture
router.get(
  '/profile-picture',
  AuthGuard.verifyUserAccessToken,
  AuthController.getProfilePicture
);

// Update profile picture (delete old → upload new)
router.put(
  '/profile-picture',
  AuthGuard.verifyUserAccessToken,
  upload.single('avatar'),
  AuthController.updateProfilePicture
);

// Delete profile picture
router.delete(
  '/profile-picture',
  AuthGuard.verifyUserAccessToken,
  AuthController.deleteProfilePicture
);

// ---------- PROFILE MANAGEMENT ----------

// Update profile info (name, phone, etc.)
router.patch(
  '/',
  AuthGuard.verifyUserAccessToken,
  ValidationMiddleware.validate(ValidationMiddleware.schema.UpdateProfile),
  AuthController.updateProfile
);

// Delete profile
router.delete('/', AuthGuard.verifyUserAccessToken, AuthController.deleteProfile);

// ---------- PASSWORD & OTP ----------

// Forgot password (sends OTP)
router.post('/forgot-password', AuthController.forgotPassword);

// Verify OTP
router.post('/verify-otp', AuthController.verifyOtp);

// Reset password (after OTP verification)
router.post('/reset-password', AuthController.resetPassword);

// ---------- LOGOUT ----------
router.post('/logout', AuthGuard.verifyUserAccessToken, AuthController.logout);

export default router;
