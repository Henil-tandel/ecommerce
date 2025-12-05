import { Op } from 'sequelize';
import { Combo } from '../../models/productcombo.model';
import Product from '../../models/product.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class ComboService {

  /** ✅ Get All Combos */
async getAllCombos() {
    const combos = await Combo.findAll({
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'slug', 'effectivePrice', 'images'],
          through: { attributes: [] }, 
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    if (!combos.length) Utils.throwError('No combos found');

    const formattedCombos = combos.map((combo: any) => {
      return {
        id: combo.id,
        name: combo.name,
        price: combo.price,
        details: combo.details,
        stock: combo.stock,
        images: combo.images,
        items: combo.Products.map((product: any) => ({
          product_id: product.product_id,
          name: product.name,
          slug: product.slug,
          effectivePrice: product.effectivePrice,
          images: product.images,
        })),
        createdAt: combo.createdAt,
        updatedAt: combo.updatedAt,
      };
    });

    return {
      status: 'success',
      message: 'Combos fetched successfully!',
      data: { success: true, data: formattedCombos },
    };

}

async getComboById(id: number) {

    const combo = await Combo.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'slug', 'effectivePrice', 'images'],
          through: { attributes: [] }, // remove ComboProducts extra info
        },
      ],
    });

    if (!combo) Utils.throwError('Combo not found.');

    const formattedCombo = {
      id: combo.id,
      name: combo.name,
      price: combo.price,
      details: combo.details,
      stock: combo.stock,
      images: combo.images,
      items: (combo as any).Products.map((product: any) => ({
        product_id: product.product_id,
        name: product.name,
        slug: product.slug,
        effectivePrice: product.effectivePrice,
        images: product.images,
      })),
    };

    return {
      success: true,
      message: 'Combo fetched successfully!',
      data: formattedCombo,
    };

}

})();
