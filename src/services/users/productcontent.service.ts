import ProductContent, { IProductContent } from "../../models/productcontent.model";
import Product from "../../models/product.model";
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class ProductContentService {

    //Get product content by id
    async getProductContentById(contentId: number) {
        const product_content = await ProductContent.findOne({ where: { id: contentId } });
        if (!product_content) Utils.throwError(ErrorMsg.PRODUCT_CONTENT.notFound);
        return {
            message: SuccessMsg.PRODUCT_CONTENT.get,
            product_content
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