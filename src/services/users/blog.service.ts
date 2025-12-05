import Blogs,{IBlogs} from '../../models/blog.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';

export default new ( class {

    // Get all blogs
    async getAllBlogs() {
        const blogs = await Blogs.findAll();
        return {
            message: SuccessMsg.BLOG.get,
            blogs
        }
    }

    // Get blog by id
    async getBlogById(blogId:number){
        const blog = await Blogs.findOne({ where: { blog_id: blogId } });
        if(!blog) Utils.throwError(ErrorMsg.BLOG.notFound);

        return {
            message: SuccessMsg.BLOG.get,
            blog
        }
    }

} )();