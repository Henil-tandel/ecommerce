import { Op } from 'sequelize';
import Combo from '../../models/productcombo.model';
import Product from '../../models/product.model';
import * as Utils from '../../lib/utils';
import { updateSingleFile } from '../../lib/file_upload';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { any } from 'joi';
import { io } from '../../server';

export default new (class ComboService {
  // Create Combo
  async createCombo(data: Record<string, any>, files?: Express.Multer.File[]) {

    const { name, price, details, stock, items } = data;
    if (!name || !price) Utils.throwError('Combo name and price are required.');

    let uploadedImages: string[] = [];
    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => updateSingleFile(file.buffer, 'combos'))
      );
      uploadedImages = uploads.map((res) => res.url);
    }

    const comboDetails = Array.isArray(details)
      ? details.map((v: any) => String(v))
      : details
        ? [String(details)]
        : [];
    const productIds = Array.isArray(items)
      ? items.map((v: any) => Number(v))
      : items
        ? [Number(items)]
        : [];


    const products = await Product.findAll({
      where: { product_id: { [Op.in]: productIds } },
      attributes: ['product_id', 'name', 'effectivePrice', 'images'],
    });

    if (!products?.length)
      Utils.throwError('No valid products found for given product_ids.');

    // Create combo
    const combo = await Combo.create({
      name,
      price: Number(price),
      details: comboDetails,
      images: uploadedImages,
      items: productIds,
      stock: stock ? Number(stock) : 0,
    });

    if (productIds.length > 0) {
      await (combo as any).setProducts(productIds);
    }

    io.of('/users').emit('create_combo', combo)

    return {
      message: SuccessMsg.COMBO.add,
      combo,
    };
  }

  // Get all combos (with product details inside `items`)
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

    if (!combos.length) Utils.throwError(ErrorMsg.COMBO.notFound);

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
      message: SuccessMsg.COMBO.get,
      data: formattedCombos,
    };

  }


  // Get combo by ID 
  async getComboById(id: number) {

    const combo = await Combo.findByPk(id, {
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'slug', 'effectivePrice', 'images'],
          through: { attributes: [] },
        },
      ],
    });

    if (!combo) Utils.throwError(ErrorMsg.COMBO.notFound);

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
      message: SuccessMsg.COMBO.get,
      formattedCombo,
    };

  }

  async updateCombo(id: number, data: Record<string, any>, files?: Express.Multer.File[]) {

    const combo = await Combo.findByPk(id);
    if (!combo) Utils.throwError(ErrorMsg.COMBO.notFound);

    const { name, price, details, stock, items } = data;

    let uploadedImages: string[] = combo.images || [];
    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => updateSingleFile(file.buffer, 'combos'))
      );
      uploadedImages = uploads.map((res) => res.url);
    }

    const comboDetails = Array.isArray(details)
      ? details.map((v: any) => String(v))
      : details
        ? [String(details)]
        : [];
    const productIds = Array.isArray(items)
      ? items.map((v: any) => Number(v))
      : items
        ? [Number(items)]
        : [];

    const products = await Product.findAll({
      where: { product_id: { [Op.in]: productIds } },
      attributes: ['product_id'],
    });

    if (!products?.length)
      Utils.throwError('No valid products found for given product_ids.');

    // Update combo fields
    combo.name = name ?? combo.name;
    combo.price = price ? Number(price) : combo.price;
    combo.details = comboDetails;
    combo.stock = stock ? Number(stock) : combo.stock;
    combo.images = uploadedImages;
    combo.items = productIds;

    await combo.save();

    if (productIds?.length > 0) {
      await (combo as any).setProducts(productIds);
    }

    io.of('/users').emit('update_combo', combo);

    return {
      message: SuccessMsg.COMBO.update,
      combo,
    };
  }

  // Delete combo
  async deleteCombo(id: number) {
    const combo = await Combo.findByPk(id);
    if (!combo) Utils.throwError(ErrorMsg.COMBO.notFound);
    await combo.destroy();
    return { message: SuccessMsg.COMBO.delete };
  }
})();
