import Category, { ICategory } from '../../models/categorys.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new (class CategoryUserService {

    // Get all categories
    async getAllCategories() {
        const categories = await Category.findAll();
        return {
            message: SuccessMsg.CATEGORY.get,
            categories
        }
    }

    // Get category by id
    async getCategoryById(categoryid: number) {
        const category = await Category.findOne({ where : { id: categoryid } })
        if(!category) Utils.throwError(ErrorMsg.CATEGORY.notFound);
        return {
            message: SuccessMsg.CATEGORY.get,
            category
        }
    }

})