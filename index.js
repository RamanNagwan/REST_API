import express from "express"
import dotenv from 'dotenv'

import dbConnection from './config/dbconnect.js'
import authRouter from './routes/authRouter.js'
import blogRouter from './routes/blogRouter.js'

import productRouter from "./routes/productRouter.js"
import bodyParser from "body-parser"
import { notFound, errorHandler } from "./controllers/errorHandler.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"

dotenv.config()
dbConnection()

const app = express()
const PORT = process.env.PORT || 4000

// app.use(express.urlencoded({extends:false}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}/`)
})