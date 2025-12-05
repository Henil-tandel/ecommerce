import Variant, { IVariant } from '../../models/productVariant.model';
import Product from '../../models/product.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import {
    uploadSingleFile,
    deleteSingleFile,
    deleteMultipleFiles,
} from '../../lib/file_upload';
import { io } from '../../server';

export default new (class VariantAdminService {

    // Helper: Update product effective price (min of variant discounted prices)
    async updateProductEffectivePrice(productId: number) {
        const variants = await Variant.findAll({ where: { product_id: productId } });

        if (!variants.length) {
            await Product.update({ effective_price: null }, { where: { product_id: productId } });
            return;
        }

        const allPrices = variants.flatMap((v: any) =>
            (v.pricing || []).map((p: any) => p.discountedPrice)
        );

        const minPrice = allPrices.length ? Math.min(...allPrices) : null;

        await Product.update({ effective_price: minPrice }, { where: { product_id: productId } });
    }

    // Create Variant (supports multiple image uploads)
    async createVariant(args: Record<string, any>, files?: Express.Multer.File[]) {
        const product = await Product.findOne({ where: { product_id: args.product_id } });
        if (!product) Utils.throwError(ErrorMsg.PRODUCT.notFound);

        let uploadedImages: string[] = [];
        if (files && files.length > 0) {
            const uploads = await Promise.all(
                files.map((file) => uploadSingleFile(file.buffer, 'variants'))
            );
            uploadedImages = uploads.map((res) => res.url);
        }

        if (args.basePrice !== undefined) {
            args.basePrice = Number(args.basePrice);
            if (isNaN(args.basePrice)) args.basePrice = 0;
        }

        let pricing: any[] = [];
        if (args.pricing) {
            const parsed = Array.isArray(args.pricing) ? args.pricing : [args.pricing];
            pricing = parsed.map((p: any) => {
                const price = Number(p.price) || 0;
                const discount = Number(p.discount) || 0;
                const discountedPrice = price - (price * discount) / 100;
                return {
                    currency: p.currency || 'INR',
                    symbol: p.symbol || '₹',
                    price,
                    discount,
                    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
                };
            });
        }

        const variant: IVariant = await Variant.create({
            ...args,
            images: uploadedImages,
            pricing,
        });

        await this.updateProductEffectivePrice(args.product_id);

        io.of('/users').emit('add_variant', variant);

        return {
            message: SuccessMsg.VARIANT.add,
            variant,
        };
    }

    // Get all variants
    async getAllVariants(productId?: number) {
        const where = productId ? { product_id: productId } : {};
        const variants = await Variant.findAll({
            where,
            include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }],
        });
        return {
            message: SuccessMsg.VARIANT.get,
            variants
        };
    }

    // Get single variant
    async getVariantById(variantId: number) {
        const variant = await Variant.findOne({
            where: { id: variantId },
            include: [{ model: Product, as: 'product', attributes: ['name', 'slug'] }],
        });
        if (!variant) Utils.throwError(ErrorMsg.VARIANT.notFound);

        await this.updateProductEffectivePrice(variant.base_price)
        return {
            message: SuccessMsg.VARIANT.get,
            variant
        };
    }

    // Update variant (supports image replace)
    async updateVariant(variantId: number, args: Record<string, any>, files?: Express.Multer.File[]) {
        const variant = await Variant.findOne({ where: { id: variantId } });
        if (!variant) Utils.throwError(ErrorMsg.VARIANT.notFound);

        let updatedImages = variant.images || [];

        if (files && files.length > 0) {
            // Delete old images
            if (variant.images && variant.images.length > 0) {
                const imageCodes = (variant.images as string[]).map((url) =>
                    url.split('/').slice(-1)[0].split('.')[0]
                );
                await Promise.all(imageCodes.map((id) => deleteSingleFile(`variants/${id}`)));
            }

            const uploads = await Promise.all(
                files.map((file) => uploadSingleFile(file.buffer, 'variants'))
            );
            updatedImages = uploads.map((res) => res.url);
        }

        if (args.basePrice !== undefined) {
            args.basePrice = Number(args.basePrice);
            if (isNaN(args.basePrice)) args.basePrice = 0;
        }

        let pricing: any[] = [];
        if (args.pricing) {
            const parsed = Array.isArray(args.pricing) ? args.pricing : [args.pricing];
            pricing = parsed.map((p: any) => {
                const price = Number(p.price) || 0;
                const discount = Number(p.discount) || 0;
                const discountedPrice = price - (price * discount) / 100;
                return {
                    currency: p.currency || 'INR',
                    symbol: p.symbol || '₹',
                    price,
                    discount,
                    discountedPrice: parseFloat(discountedPrice.toFixed(2)),
                };
            });
        }

        await variant.update({
            ...args,
            images: updatedImages,
            pricing,
        });

        await this.updateProductEffectivePrice(variant.product_id);

        io.of('/users').emit('update_variant', variant);

        return {
            message: SuccessMsg.VARIANT.update,
            variant,
        };
    }

    // Delete variant (and associated images)
    async deleteVariant(variantId: number) {
        const variant = await Variant.findOne({ where: { id: variantId } });
        if (!variant) Utils.throwError(ErrorMsg.VARIANT.notFound);

        if (variant.images?.length) {
            await deleteMultipleFiles(variant.images);
        }

        const productId = variant.product_id;
        await Variant.destroy({ where: { id: variantId } });

        await this.updateProductEffectivePrice(productId);

        return {
            message: SuccessMsg.VARIANT.delete
        };
    }
})();
