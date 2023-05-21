import Product from '../models/productModel.js'
import expressAsyncHandler from 'express-async-handler'
import slugify from 'slugify'


// Creae Product
const prodcutCreate = expressAsyncHandler(
    async (req, res) => {
        try {
            const createProduct = await Product.create(req.body)
            res.json(createProduct)
        } catch (error) {
            throw new Error(error)
        }
    }
)

// Get Single Product
const getaProduct = expressAsyncHandler(
    async (req, res) => {
        try {
            const { id } = req.params
            const getProduct = await Product.findById(id)
            res.json(getProduct)
        } catch (error) {
            throw new Error(error)
        }
    }
)

// Get All Product
const getAllProduct = expressAsyncHandler(
    async (req, res) => {
        try {
            const queryObj = { ...req.query }
            const explodefilds = ['sort', 'limit', 'page', 'fields']
            explodefilds.forEach((el) => { delete queryObj[el] })
            console.log(queryObj)
            const queryString = JSON.stringify(queryObj)
            queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => { `$${match}` })

            let query = Product.find(JSON.parse(queryString))

            // sorting
            if (req.query.sort) {
                const sortBy = req.query.sort.split(",").join(' ')
                query = query.sort(sortBy)
            } else {
                query = query.sort('-createdAt')
            }

            // Limits the fields
            if (req.query.fields) {
                const field = req.query.fields.split(',').join(" ")
                query = query.select(field)
            } else {
                query = query.select("-__v")
            }


            // Pagination
            const page = req.query.page
            const limit = req.query.limit
            const skip = (page - 1) * limit
            console.log(page, limit, skip)

            query = query.skip(skip).limit(limit)

            if (req.query.page) {
                const queryDocument = await Product.countDocuments()
                if (skip >= queryDocument) throw new Error("This page dose not exists")
            }

            const allProduct = await query
            // const allProduct = await Product.find()

            // const allProduct = await Product.find(req.query)
            // const allProduct = await Product.find({"category":req.query.category})
            // const allProduct = await Product.where(category).equals(req.query.category)
            // const allProduct = await Product.find(req.query)
            res.json(allProduct)
        } catch (error) {
            throw new Error(error)
        }
    }
)

// Product Update
const productUpdate = expressAsyncHandler(
    async (req, res) => {

        const { id } = req.params
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title)
            }
            const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
            res.json(updateProduct)
        } catch (error) {
            throw new Error(error)
        }
    }
)


// Delete Product
const deleteProduct = expressAsyncHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const deleteProduct = await Product.findOneAndDelete(id, { new: true })
            res.json({
                "message": "Product is deleted."
            })
        } catch (error) {
            throw new Error(error)
        }
    }
)

export { prodcutCreate, getaProduct, getAllProduct, productUpdate, deleteProduct }