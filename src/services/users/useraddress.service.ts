import Address, { IUserAddress } from '../../models/useraddress.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class AddressService {
  async addAddress(args: Record<string, unknown>, userId: number) {
    const newAddress: IUserAddress = await Address.create({ user_id: userId, ...args });

    return {
      message: SuccessMsg.ADDRESS.add,
      address: newAddress,
    };
  }

  async getDefaultAddress(userId: number) {
    const defaultAddress = await Address.findAll({ where: { user_id: userId , is_default: true } });
    
    return {
      message: SuccessMsg.ADDRESS.getdefault,
      defaultAddress
    }
  }

  async getAllAddress(userId: number) {
    const addressDetails = await Address.findAll({ where: { user_id: userId } });

    return {
      message: SuccessMsg.ADDRESS.get,
      address: addressDetails,
    };
  }

  async updateAddress(args: Record<string, unknown>, addressId: string) {
    await Address.update(args, { where: { id: addressId } });

    const address: IUserAddress = await Address.findOne({ where: { id: addressId } });
    if (!address) {
      Utils.throwError(ErrorMsg.ADDRESS.notFound);
    }
    return {
      message: SuccessMsg.ADDRESS.update,
      address: address,
    };
  }

  async deleteAddress(args: Record<string, unknown>, userId: number) {
    const AddressDetails = await Address.destroy({
      where: {
        id: args.addressId,
        user_id: userId,
      },
    });
    if (!AddressDetails) {
      Utils.throwError(ErrorMsg.ADDRESS.notFound);
    }
    return {
      message: SuccessMsg.ADDRESS.delete,
    };
  }

})();
