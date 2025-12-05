import { IAdminLoginData } from '../../middleware/validation.middleware';
import AdminUser, { IAdminUser } from '../../models/admin.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import * as HashUtils from '../../lib/hash.utils';
import * as JwtUtils from '../../lib/jwt.utils';

export default new (class AdminUserService {
  async login(args: IAdminLoginData) {
    const adminUser: IAdminUser = await AdminUser.findOne({ where: { email: args.email } });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }

    const hashCompareResult = await HashUtils.compareHash(args.password, adminUser.password);
    if (!hashCompareResult) {
      Utils.throwError(ErrorMsg.USER.incorrectCredentials);
    }

    delete adminUser.password;
    const admin = await AdminUser.findOne({ where: { email: args.email } });

    const token = await JwtUtils.createToken({ ...admin.dataValues, type: 'admin' } as object);
    return {
      message: SuccessMsg.USER.login,
      user: adminUser,
      token: token,
    };
  }

  async me(args: Record<string, string | Date | number | object>) {
    const adminUser: IAdminUser = await AdminUser.findOne({
      where: { id: args.userId },
      attributes: { exclude: ['password'] },
    });
    if (!adminUser) {
      Utils.throwError(ErrorMsg.USER.notFound);
    }
    return {
      user: adminUser,
    };
  }


})();
