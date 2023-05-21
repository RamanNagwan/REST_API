import errorHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const authmiddleware = errorHandler(async (req, res, next) => {
    let token
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user =await User.findById(decoded.id)
        req.user = user
    } else {
        throw new Error("There is no token attached to header")
    }
    next()
})

const isAdmin = errorHandler(
    (req,res,next)=>{
    if(req.user.role !== 'admin'){
        throw new Error("Your are not admin")
    }else{
        next()
    }
}
)

export { authmiddleware, isAdmin }