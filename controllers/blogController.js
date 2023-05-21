import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";

const createBlog = expressAsyncHandler(
    async (req, res) => {
        try {
            const newBlog = await Blog.create(req.body)
            res.json(newBlog)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const updateBlog = expressAsyncHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true })
            res.json(updatedBlog)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getaBlog = expressAsyncHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const singleBlog = await Blog.findById(id).populate('isLikes')
            await Blog.findByIdAndUpdate(id, { $inc: { numberViews: 1 } }, { new: true })
            res.json(singleBlog)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const getAllBlog = expressAsyncHandler(
    async (req, res) => {
        try {
            const allBlog = await Blog.find()
            res.json(allBlog)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const deletBlog = expressAsyncHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const deleted = await Blog.findByIdAndDelete(id)
            res.json(deleted)
        } catch (error) {
            throw new Error(error)
        }
    }
)

const isLiked = expressAsyncHandler(
    async (req, res) => {
        try {
            const { blogId } = req.body
            const loginUserId = req?.user?._id
            const blog = await Blog.findById(blogId)
            const isLiked = blog?.isLikes
            const alreadyDisLiked = blog?.isDislikes

            if (alreadyDisLiked) {
                const blog = await Blog.findByIdAndUpdate(
                    blogId, {
                    $pull: { disLikedUserId: loginUserId },
                    isDislikes: false
                }, {
                    new: true
                }
                )
                res.json(blog)
            }
            if (isLiked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { likeUserId: loginUserId },
                    isLikes: false
                }, {
                    new: true
                })
                res.json(blog)
            } else {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $push: { likeUserId: loginUserId },
                    isLikes: true
                }, {
                    new: true
                })
                res.json(blog)
            }

        } catch (error) {
            throw new Error(error)
        }
    }
)

const isTheDislike = expressAsyncHandler(
    async (req, res) => {
        try {
            const { blogId } = req.body
            const blog = Blog.findById(blogId)
            const loginUserId = await req.user._id

            const isDisliked = blog?.isDislikes
            const alreadyLiked = blog?.isLikes

            if (alreadyLiked) {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $pull: { likeUserId: loginUserId },
                    isLikes: false
                }, {
                    new: true
                })
                res.json(blog)
            }
            if (isDisliked) {
                const blog = await Blog.findOneAndUpdate(blogId, {
                    $pull: { disLikedUserId: loginUserId },
                    isDislikes: false
                }, {
                    new: true
                })
                res.json(blog)
            } else {
                const blog = await Blog.findByIdAndUpdate(blogId, {
                    $push: { disLikedUserId: loginUserId },
                    isDislikes: true
                }, {
                    new: true
                })
                res.json(blog)
            }
        }catch(error){
            throw new Error(error)
        }
    }
)

export {
    createBlog,
    updateBlog,
    getaBlog,
    getAllBlog,
    deletBlog,
    isLiked,
    isTheDislike
}
