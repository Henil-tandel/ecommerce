import { Request, Response } from 'express';
import productcomboService from '../../services/users/productcombo.service';
import * as Utils from '../../lib/utils';

export const productComboController = {

  getAllCombos: async (req: Request, res: Response) => {
    try {
      const result = await productcomboService.getAllCombos();
      res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },

  // Get Combo by ID 
  getComboById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await productcomboService.getComboById(id);
      res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
    } catch (err) {
      res.status(Utils.getErrorStatusCode(err)).send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },

};
