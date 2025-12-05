import { Request, Response } from "express";
import * as Utils from "../../lib/utils";
import blogService from "../../services/admin/blog.service";
import { IRequest } from "../../lib/common.interface";

export default new (class BlogController {

    // Create a blog
    createBlog = (req: IRequest, res: Response) => {
        try {
            const { title, content } = req.body;
            const file = req.file;
            blogService.createBlog({ title, content },file)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });            
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Get all blogs
    getAllBlogs = ( req: Request, res: Response ) => {
        try {
            blogService.getAllBlogs()
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });            
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Get blog by id
    getBlogById = ( req: IRequest, res: Response) => {
        try {
            const blogId = Number(req.params.blog_id)
            blogService.getBlogById(blogId)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });             
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Update blog
    updateBlog = ( req: IRequest, res: Response) => {
        try {
            const { title, content } = req.body;
            const file = req.file;
            const blogId = Number(req.params.blog_id);
            blogService.updateBlog({ title, content },blogId,file)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });             
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    }

    // Delete blog
        deleteBlog = ( req: IRequest, res: Response) => {
        try {
            const blogId = Number(req.params.blog_id)
            blogService.deleteBlog(blogId)
                .then((result) => {
                    res.status(Utils.statusCode.OK).send(Utils.sendSuccessResponse(result));
                })
                .catch((err) => {
                    res
                        .status(Utils.getErrorStatusCode(err))
                        .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
                });             
        } catch (err) {
            res
                .status(Utils.getErrorStatusCode(err))
                .send(Utils.sendErrorResponse(Utils.getErrorMsg(err)));
        }
    } 
})();