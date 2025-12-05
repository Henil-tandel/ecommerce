import { Request, Response } from 'express';
import * as Utils from '../../lib/utils';
import UserService from '../../services/users/userAuth.service';
import { IRequest } from '../../lib/common.interface';
import multer from 'multer';

// ---------- MULTER SETUP FOR FILE UPLOAD ----------
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export default new (class AuthController {
  // ---------- REGISTER ----------
  userRegister = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, any>;
      const fileBuffer = req.file?.buffer;
      UserService.register(body, req.params.role, fileBuffer)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- LOGIN ----------
  login = (req: Request, res: Response): void => {
    try {
      const body = req.body as Record<string, string>;
      UserService.login(body)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- FETCH MY PROFILE ----------
  me = (req: IRequest, res: Response): void => {
    try {
      const args = { userId: req.user.userid };
      UserService.me(args)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  updateProfile = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, any>;
      UserService.updateProfile(body, req.user.userid)
        .then((result) =>
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result))
        )
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)))
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };


  // ---------- PROFILE PICTURE: UPLOAD ----------
  uploadProfilePicture = (req: IRequest, res: Response): void => {
    try {
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer)
        res
          .status(Utils.statusCode.BAD_REQUEST)
          .send(Utils.sendErrorResponse({ message: 'No file uploaded' }));

      UserService.uploadProfilePicture(req.user.userid, fileBuffer)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- PROFILE PICTURE: GET ----------
  getProfilePicture = (req: IRequest, res: Response): void => {
    try {
      UserService.getProfilePicture(req.user.userid)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- PROFILE PICTURE: UPDATE ----------
  updateProfilePicture = (req: IRequest, res: Response): void => {
    try {
      const fileBuffer = req.file?.buffer;
      if (!fileBuffer)
        res
          .status(Utils.statusCode.BAD_REQUEST)
          .send(Utils.sendErrorResponse({ message: 'No file uploaded' }));

      UserService.updateProfilePicture(req.user.userid, fileBuffer)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- PROFILE PICTURE: DELETE ----------
  deleteProfilePicture = (req: IRequest, res: Response): void => {
    try {
      UserService.deleteProfilePicture(req.user.userid)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- FORGOT PASSWORD ----------
  forgotPassword = (req: Request, res: Response): void => {
    try {
      const { email } = req.body;
      UserService.forgotPassword(email)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- VERIFY OTP ----------
  verifyOtp = (req: Request, res: Response): void => {
    try {
      const { email, otp } = req.body;
      UserService.verifyOtp(email, otp)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- RESET PASSWORD ----------
  resetPassword = (req: Request, res: Response): void => {
    try {
      const { email, otp, newPassword } = req.body;
      UserService.resetPassword(email, otp, newPassword)
        .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
        .catch((err) =>
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
        );
    } catch (err) {
      res
        .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // ---------- DELETE PROFILE ----------
  deleteProfile = (req: IRequest, res: Response): void => {
    UserService.deleteUser(req.user.userid)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };

  // ---------- LOGOUT ----------
  logout = (req: IRequest, res: Response): void => {
    UserService.logout(req.user.userid)
      .then((result) => res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result)))
      .catch((err) =>
        res
          .status(Utils.getErrorStatusCode(err))
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(err))),
      );
  };
})();
