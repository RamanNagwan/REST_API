import express from 'express'
import { authmiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
    createBlog,
    deletBlog,
    isTheDislike,
    getAllBlog,
    getaBlog,
    isLiked,
    updateBlog
} from '../controllers/blogController.js'
const router = express.Router()

router.post('/', createBlog)
router.put('/:id', updateBlog)
router.get('/:id', getaBlog)
router.put('/dislike/:id', authmiddleware,isTheDislike)
router.put('/like/:id', authmiddleware, isLiked)
router.get('/', getAllBlog)
router.delete('/:id', deletBlog)

export default router