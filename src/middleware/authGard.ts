import * as Utils from '../lib/utils';
import * as JwtUtils from '../lib/jwt.utils';
import { ErrorMsg } from '../lib/constants';
import { Response, NextFunction } from 'express';
import { IAdminUser } from '../models/admin.model';
import Users, { IUser } from '../models/users.model';
import { IRequest } from '../lib/common.interface';

function verifyAdminAccessToken(req: IRequest, res: Response, next: NextFunction) {
  try {
    const authToken = req.headers['authorization'];
    if (!authToken) {
      return res
        .status(Utils.statusCode.UNAUTHORIZED)
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.USER.requireAuthToken)));
    }
    const bearer = authToken.split('Bearer ');
    const bearerToken = bearer[1];

    JwtUtils.verifyToken(bearerToken)
      .then((response: IAdminUser) => {
        req.admin = response;
        req.token = bearerToken;
        next();
      })
      .catch((error: Error) => {
        return res
          .status(Utils.statusCode.UNAUTHORIZED)
          .send(Utils.sendErrorResponse(Utils.getErrorMsg(error.message)));
      });
  } catch (e) {
    return res
      .status(Utils.statusCode.INTERNAL_SERVER_ERROR)
      .send(Utils.sendErrorResponse(Utils.getErrorMsg(ErrorMsg.EXCEPTIONS.wentWrong)));
  }
}

async function verifyUserAccessToken(req: IRequest, res: Response, next: NextFunction) {
  try {
    const authToken = req.headers['authorization'];
    if (!authToken) throw new Error('Auth token missing');

    const bearerToken = authToken.replace('Bearer ', '').trim();
    if (!bearerToken) throw new Error('Bearer token missing');

    const payload = await JwtUtils.verifyToken(bearerToken); // this is your decoded token
    const userId = (payload as any).userId; // <--- use userId, NOT userid

    if (!userId) throw new Error('Token payload invalid');

    const user = await Users.findOne({ where: { userid: userId } });
    if (!user) throw new Error('User not found');

    req.user = user;
    req.userId = user.userid;
    req.token = bearerToken;

    next();
  } catch (e: any) {
    return res.status(401).send({ status: 'error', message: e.message });
  }
}



export { verifyAdminAccessToken, verifyUserAccessToken };
