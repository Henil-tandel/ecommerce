import Product, { IProduct } from '../../models/product.model';
import Variant from '../../models/productVariant.model';
import Category from '../../models/categorys.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import {
  uploadSingleFile,
  deleteMultipleFiles,
} from '../../lib/file_upload';
import slugify from 'slugify';
import { ISearch } from '../../lib/common.interface';
import { Op } from 'sequelize';
import { io } from '../../server';
import { generate } from "csv-generate";

export default new (class ProductAdminService {
  //  Create Product
  async createProduct(args: Record<string, any>, files?: Express.Multer.File[]) {
    let uploadedImages: string[] = [];

    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => uploadSingleFile(file.buffer, 'products'))
      );
      uploadedImages = uploads.map((res) => res.url);
    }

    // Fix array fields (from form-data)
    const multipleCategory = Array.isArray(args.multipleCategory)
      ? args.multipleCategory.map((v: any) => Number(v))
      : args.multipleCategory
        ? [Number(args.multipleCategory)]
        : [];

    const relatedCategories = Array.isArray(args.relatedCategories)
      ? args.relatedCategories.map((v: any) => Number(v))
      : args.relatedCategories
        ? [Number(args.relatedCategories)]
        : [];

    const nameSlug = slugify(args.name, { lower: true, strict: true });
    const generatedSKU =
      (args.categoryCode ? args.categoryCode.toUpperCase() + '-' : '') +
      nameSlug.substring(0, 10).toUpperCase().replace(/-/g, '') +
      '-' +
      Math.floor(100 + Math.random() * 900);

    const product = await Product.create({
      ...args,
      slug: nameSlug,
      images: uploadedImages,
    });

    const multipleCategoriesData = multipleCategory.length
      ? await Category.findAll({
        where: { id: multipleCategory },
        attributes: ['id', 'name'],
      })
      : [];

    const relatedCategoriesData = relatedCategories.length
      ? await Category.findAll({
        where: { id: relatedCategories },
        attributes: ['id', 'name'],
      })
      : [];

    io.of('/users').emit('new_product', product);

    return {
      message: 'Product created successfully!',
      data: {
        ...product.toJSON(),
        multipleCategories: multipleCategoriesData,
        relatedCategories: relatedCategoriesData,
      },
    };
  }


  // Update Product
  async updateProduct(productId: number, args: Record<string, any>, files?: Express.Multer.File[]) {
    const product = await Product.findOne({ where: { product_id: productId } });
    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

    let uploadedImages: string[] = [];
    if (files && files.length > 0) {
      const uploads = await Promise.all(
        files.map((file) => uploadSingleFile(file.buffer, 'products'))
      );
      uploadedImages = uploads.map((res) => res.url);
    }

    const multipleCategory = Array.isArray(args.multipleCategory)
      ? args.multipleCategory.map((v: any) => Number(v))
      : args.multipleCategory
        ? [Number(args.multipleCategory)]
        : [];
    const relatedCategories = Array.isArray(args.relatedCategories)
      ? args.relatedCategories.map((v: any) => Number(v))
      : args.relatedCategories
        ? [Number(args.relatedCategories)]
        : [];

    let newSlug = product.slug;
    if (args.name && args.name !== product.name) {
      newSlug = slugify(args.name, { lower: true, strict: true });
    }

    const variants = await Variant.findAll({ where: { product_id: productId } });

    let effectivePrice = null;

    if (variants.length > 0) {
      const allPrices = variants
        .flatMap((v: any) => v.pricing || [])
        .map((p: any) => p.discountedPrice)
        .filter((p) => typeof p === 'number');
    }

    await product.update({
      ...args,
      slug: newSlug,
      images: uploadedImages.length ? uploadedImages : product.images,
    });

    const multipleCategoriesData = multipleCategory.length
      ? await Category.findAll({
        where: { id: multipleCategory },
        attributes: ['id', 'name'],
      })
      : [];

    const relatedCategoriesData = relatedCategories.length
      ? await Category.findAll({
        where: { id: relatedCategories },
        attributes: ['id', 'name'],
      })
      : [];

    io.of('/users').emit('product_updated', product)

    return {
      message: SuccessMsg.PRODUCT.update,
      data: {
        ...product.toJSON(),
        multipleCategories: multipleCategoriesData,
        relatedCategories: relatedCategoriesData,
      },
    };
  }

  // Get All Products (with variants)
  async getAllProducts(args: ISearch) {
    const page = Number(args.page) || 1;
    const limit = Number(args.limit) || 10;
    const search = args.search?.trim() || "";
    const category_id = Number(args.category_id) || undefined;
    const stock = Number(args.stock) || undefined;
    const skip = (page - 1) * limit;

    let where: any = {};
    
    const firstLetter = search.charAt(0);
    if (firstLetter) {
      where.name = {
        [Op.like]: `${firstLetter}%`,
      };
    }

    if (stock) {
      where.stock = stock
    }

    if (category_id) {
      where.category_id = category_id
    }

    const totalCount = await Product.count({ where: where });
    const totalPage = Math.ceil(totalCount / limit);

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Variant, as: 'variants' },
      ],
      order: [['name', 'ASC']],
      offset: skip,
      limit: limit
    });

    return {
      message: SuccessMsg.PRODUCT.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      product: products
    }
  }

  async getProductById(productId: number) {
    const product = await Product.findOne({
      where: { product_id: productId },
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Variant, as: 'variants' },
      ],
    });

    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);
    return {
      message: SuccessMsg.PRODUCT.get,
      product,
    };
  }

  // Delete Product
  async deleteProduct(productId: number) {
    const product = await Product.findOne({ where: { product_id: productId } });
    if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

    if (product.images?.length) {
      await deleteMultipleFiles(product.images);
    }

    await Product.destroy({ where: { product_id: productId } });
    return { message: SuccessMsg.PRODUCT.delete };
  }

  async generateProductCSV(args: ISearch) {

    const search = args.search?.trim() || "";
    const category_id = Number(args.category_id) || undefined;
    const stock = Number(args.stock) || undefined;

    const where: any = {};

    if (search.length > 0) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    if (category_id) where.category_id = category_id;
    if (stock) where.stock = stock;

    const products = await Product.findAll();

    const csvRows = [
      ["ID", "Name", "Slug", "Price", "Stock", "Images", "Images Count"],
      ...products.map((p) => [
        p.product_id.toString(),
        p.name,
        p.slug || "",
        p.effective_price?.toString() || "",
        p.stock?.toString() || "",
        Array.isArray(p.images) ? p.images.join(" | ") : "",
        (p.images?.length || 0).toString(),
      ])
    ];

    return new Promise<Buffer>((resolve, reject) => {
      const generator = generate({
        objectMode: true,
        length: csvRows.length,
        columns: csvRows[0].length
      });

      let rowIndex = 0;
      const finalRows: string[][] = [];

      generator
        .on("readable", function () {
          let row;

          while ((row = this.read()) !== null) {
            finalRows.push(csvRows[rowIndex]);
            rowIndex++;
          }
        })
        .on("error", reject)
        .on("end", () => {
          const csvText = finalRows.map((r) => r.join(",")).join("\n");
          resolve(Buffer.from(csvText, "utf-8"));
        });
    });
  }

})();
