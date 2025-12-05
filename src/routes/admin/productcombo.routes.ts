import express from 'express';
import {comboController} from '../../controller/admin/productcombo.controller'
import { upload } from '../../controller/users/userauth.controller';

const router = express.Router();

router.post('/', upload.array('images',5), comboController.createCombo);
router.get('/', comboController.getAllCombos);
router.get('/:id', comboController.getComboById);
router.put('/:id',upload.array('images',5),comboController.updateCombo);
router.delete('/:id', comboController.deleteCombo);

export default router;
