import Product, { IProduct } from '../../models/product.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import { Op } from 'sequelize';
import Category from '../../models/categorys.model';
import { ISearch } from '../../lib/common.interface';
import Variant from '../../models/productVariant.model';
import { generate } from "csv-generate";

export default new (class ProductAdminService {

  // Get a product by id
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

  // Get all products
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

  async getProductByCategory(args: ISearch, categoryId: number) {
    const page = Number(args.page) || 1;
    const limit = Number(args.limit) || 10;
    const skip = (page - 1) * limit;
    const category = await Category.findOne({ where: { id: categoryId } });
    if (!category) Utils.throwError(ErrorMsg.CATEGORY.notFound);

    let where: any = {};

    const totalCount = await Product.count({ where: where });
    const totalPage = Math.ceil(totalCount / limit);    

    const products = await Product.findAll({
      where: { category_id: category.id },
      offset: skip,
      limit: limit
    })

    if (!products) Utils.throwError(ErrorMsg.PRODUCT.notFound)

    return {
      message: SuccessMsg.PRODUCT.get,
      page: page,
      perPage: limit,
      totalCount: totalCount,
      totalPage: totalPage,
      products
    }
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

    const products = await Product.findAll({
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
        { model: Variant, as: "variants" },
      ],
      order: [["product_id", "DESC"]],
    });

    const csvRows = [
      ["ID", "Name", "Slug", "Price", "Stock", "Images Count"],
      ...products.map((p) => [
        p.product_id.toString(),
        p.name,
        p.slug || "",
        p.effective_price?.toString() || "",
        p.stock?.toString() || "",
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