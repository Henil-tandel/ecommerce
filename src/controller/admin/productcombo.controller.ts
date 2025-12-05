import { Request, Response } from 'express';
import ComboService from '../../services/admin/productcombo.service';
import * as Utils from '../../lib/utils';
import { IRequest } from '../../lib/common.interface';

export const comboController = {

  //Create Combo
  createCombo: async (req: IRequest, res: Response) => {
    try {
      const { name, price, details, stock, items } = req.body;

      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files?.images || []) as Express.Multer.File[];

      const result = await ComboService.createCombo(
        { name, price, details, stock, items },
        files
      );

      res
        .status(Utils.statusCode.CREATED)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      console.error('createCombo Controller Error:', err);
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },


  //Get All Combos
  getAllCombos: async (req: Request, res: Response) => {
    try {
      const result = await ComboService.getAllCombos();
      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      console.error('getAllCombos Controller Error:', err);
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },

  //Get Combo by ID
  getComboById: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await ComboService.getComboById(id);
      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      console.error('getComboById Controller Error:', err);
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },

  updateCombo: async (req: IRequest, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { name, price, details, stock, items } = req.body;

      const files = Array.isArray(req.files)
        ? (req.files as Express.Multer.File[])
        : (req.files?.images || []) as Express.Multer.File[];

      const result = await ComboService.updateCombo(
        id,
        { name, price, details, stock, items },
        files
      );

      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      console.error('updateCombo Controller Error:', err);
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },

  // Delete Combo
  deleteCombo: async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await ComboService.deleteCombo(id);
      res
        .status(Utils.statusCode.OK)
        .send(Utils.sendSuccessResponse(result));
    } catch (err) {
      console.error('deleteCombo Controller Error:', err);
      res
        .status(Utils.getErrorStatusCode(err))
        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
    }
  },
};
