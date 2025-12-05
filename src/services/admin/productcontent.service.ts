import ProductContent, { IProductContent } from "../../models/productcontent.model";
import Product from "../../models/product.model";
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class ProductContentService {

    // Create productcontent
    async createProductContent(args: Record<string, any>) {
        const { product_id, description, features, specifications, materials, dimensions, warranty, care_instructions, images } = args;
        const product = await Product.findOne({ where: { product_id: product_id } });
        if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

        const product_content = await ProductContent.create({
            product_id,
            description,
            features,
            specifications,
            materials,
            dimensions,
            warranty,
            care_instructions,
            images,
        });

        return {
            message: SuccessMsg.PRODUCT_CONTENT.add,
            product_content
        }
    }

    // Get all product content
    async getAllProductContent() {
        const product_content = await ProductContent.findAll();
        return {
            message: SuccessMsg.PRODUCT_CONTENT.get,
            product_content
        }
    }

    //Get product content by id
    async getProductContentById(contentId: number) {
        const product_content = await ProductContent.findOne({ where: { id: contentId } });
        if (!product_content) Utils.throwError(ErrorMsg.PRODUCT_CONTENT.notFound);
        return {
            message: SuccessMsg.PRODUCT_CONTENT.get,
            product_content
        }
    }

    // Update a product content
    async updateProductContent(contentId: number, args: Record<string, unknown>) {
        const product_content = await ProductContent.findOne({ where: { id: contentId } });
        if (!product_content) Utils.throwError(ErrorMsg.PRODUCT_CONTENT.notFound);

        await product_content.update(args);

        return {
            message: SuccessMsg.PRODUCT_CONTENT.update,
            product_content
        }
    }

    // Delete a product content
    async deleteProductContent(contentId: number) {
        const product_content = await ProductContent.findOne({ where: { id: contentId } });
        if (!product_content) Utils.throwError(ErrorMsg.PRODUCT_CONTENT.notFound);

        await product_content.destroy();

        return {
            message: SuccessMsg.PRODUCT_CONTENT.delete
        }
    }

    // Get product with content
    async getProductWithContent(productId: number) {
        const product = await Product.findOne({
            where: { product_id: productId },
            include: [{ model: ProductContent, 
                as : 'contents',
                attributes: ['description','features','specifications','materials','warranty','careInstructions','images'] }]
        });
        if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

        return {
            message: SuccessMsg.PRODUCT.get,
            product
        }
    }
})();