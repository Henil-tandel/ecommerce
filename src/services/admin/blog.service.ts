import Blogs,{IBlogs} from '../../models/blog.model';
import * as Utils from '../../lib/utils';
import { ErrorMsg, SuccessMsg } from '../../lib/constants';
import {
    uploadSingleFile,
    updateSingleFile,
    deleteSingleFile,
} from '../../lib/file_upload';

export default new ( class {
    // Create a blog
    async createBlog(args: Record<string, any>, file?: Express.Multer.File){
        const existing = await Blogs.findOne({ where: { title: args.title } });
        if(existing) Utils.throwError(ErrorMsg.BLOG.alreadyExist);

        let uploadData = null;
        if(file) {
            uploadData = await uploadSingleFile(file.buffer,'blogs');
        }

        const blog:IBlogs = await Blogs.create({
            ...args,
            image_url: uploadData.url || null,
            image_id: uploadData.public_id || null
        })

        return {
            message: SuccessMsg.BLOG.add,
            blog
        }
    }

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

    // Update blog
    async updateBlog(args: Record<string,any>,blogId: number, file?:Express.Multer.File){
        const blog = await Blogs.findOne({ where: { blog_id: blogId } });
        if(!blog) Utils.throwError(ErrorMsg.BLOG.notFound);
        
        let updatedImageData = null

        if(blog.blog_id) {
            updatedImageData = await updateSingleFile(file.buffer,'blogs',blog.image_id)
        } else {
            updatedImageData = await uploadSingleFile(file.buffer,'blogs')
        }

        await blog.update({
            ...args,
            image_url: updatedImageData.url || blog.image_url,
            image_id: updatedImageData.public_id || blog.image_id
        });

        return {
            message: SuccessMsg.BLOG.update,
            blog
        }
    }

    // Delete blog
    async deleteBlog(blogId: number) {
        const blog = await Blogs.findOne({ where: { blog_id: blogId } });
        if(!blog) Utils.throwError(ErrorMsg.BLOG.notFound);

        if(blog.blog_id) {
            await deleteSingleFile(blog.image_id)
        }

        await Blogs.destroy({ where: { blog_id: blogId } });

        return {
            message: SuccessMsg.BLOG.delete
        }
    }
} )();