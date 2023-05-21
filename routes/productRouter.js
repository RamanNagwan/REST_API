import express from "express";
import {
    deleteProduct,
    getAllProduct,
    getaProduct,
    prodcutCreate,
    productUpdate
} from "../controllers/productController.js";
import { authmiddleware, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.get('/:id', getaProduct)
router.get('/', getAllProduct)
router.post('/', authmiddleware, isAdmin, prodcutCreate)
router.put('/:id', authmiddleware, isAdmin, productUpdate)
router.delete('/:id', authmiddleware, isAdmin, deleteProduct)
export default router