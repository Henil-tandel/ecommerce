import { Response } from 'express';
import * as Utils from '../../lib/utils';
import AddressService from '../../services/users/useraddress.service';
import { IRequest } from '../../lib/common.interface';

export default new (class AddressController {

  // Add address
  addAddress = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      const args: Record<string, unknown> = {
        full_name: body.full_name,
        address_line1: body.address_line1,
        address_line2: body.address_line2,
        zip_code: body.zip_code,
        mobile: body.mobile,
        city: body.city,
        state: body.state,
        country: body.country
      };
      AddressService.addAddress(args, req.user.userid)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  //View default address
  getDefaultAddress = (req: IRequest, res: Response) => {
    try {
      AddressService.getDefaultAddress(req.user.userid)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });      
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  }

  // View all addresses
  viewAllAddress = (req: IRequest, res: Response) => {
    try {
      AddressService.getAllAddress(req.user.userid)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Update address
  updateAddress = (req: IRequest, res: Response): void => {
    try {
      const body = req.body as Record<string, unknown>;
      AddressService.updateAddress(body, req.params.address_id)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };

  // Delete address
  deleteAddress = (req: IRequest, res: Response): void => {
    try {
      const args = {
        addressId: req.params.address_id,
      };
      AddressService.deleteAddress(args, req.user.userid)
        .then((result) => {
          res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
        })
        .catch((err) => {
          res
            .status(Utils.getErrorStatusCode(err))
            .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        });
    } catch (err) {
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  };
  
})();
