import Category, { ICategory } from '../../models/categorys.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import {
  uploadSingleFile,
  updateSingleFile,
  deleteSingleFile,
} from '../../lib/file_upload';

export default new (class CategoryAdminService {
  // Create category (with image upload)
  async createCategory(args: Record<string, any>, file?: Express.Multer.File) {
    const existing = await Category.findOne({ where: { name: args.name } });
    if (existing) Utils.throwError(ErrorMsg.CATEGORY.alreadyExist);

    let uploadData = null;
    if (file) {
      uploadData = await uploadSingleFile(file.buffer, 'categories');
    }

    const category: ICategory = await Category.create({
      ...args,
      category_url: uploadData?.url || null,
      category_code: uploadData?.public_id || null,
    });

    return {
      message: SuccessMsg.CATEGORY.add,
      category,
    };
  }

  // Get all categories
  async getAllCategories() {
    const categories = await Category.findAll();
    return {
      message: SuccessMsg.CATEGORY.get,
      categories,
    };
  }

  // Get single category
  async getCategoryById(categoryId: number) {
    const category = await Category.findOne({ where: { id: categoryId } });
    if (!category) Utils.throwError(ErrorMsg.CATEGORY.notFound);
    return {
      message: SuccessMsg.CATEGORY.get,
      category,
    };
  }

  // Update category (with image update)
  async updateCategory(args: Record<string, any>, categoryId: number, file?: Express.Multer.File) {
    const category = await Category.findOne({ where: { id: categoryId } });
    if (!category) Utils.throwError(ErrorMsg.CATEGORY.notFound);

    let updatedImageData = null;

    // Handle image update if file is provided
    if (file) {
      if (category.category_code) {
        // Replace old image
        updatedImageData = await updateSingleFile(file.buffer, 'categories', category.category_code);
      } else {
        // Upload new image
        updatedImageData = await uploadSingleFile(file.buffer, 'categories');
      }
    }

    // Update category fields
    await category.update({
      ...args,
      category_url: updatedImageData?.url || category.category_url,
      category_code: updatedImageData?.public_id || category.category_code,
    });

    return {
      message: SuccessMsg.CATEGORY.update,
      category,
    };
  }

  // Delete category + image
  async deleteCategory(categoryId: number) {
    const category = await Category.findOne({ where: { id: categoryId } });
    if (!category) Utils.throwError(ErrorMsg.CATEGORY.notFound);

    if (category.category_code) {
      await deleteSingleFile(category.category_code);
    }

    await Category.destroy({ where: { id: categoryId } });

    return {
      message: SuccessMsg.CATEGORY.delete,
    };
  }
})();
