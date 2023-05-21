import User from '../models/userModel.js'
import errorHandler from 'express-async-handler'
import { generteToken } from '../config/jsonWebToken.js'
import { generateRefreshToken } from '../config/refreshToken.js'
import jwt from 'jsonwebtoken'
import ObjectId from 'mongo-objectid'

// Create New User
const createUser = errorHandler(
    async (req, res) => {
        const email = req.body.email
        const findUser = await User.findOne({ email: email })

        if (!findUser) {
            const newUser = await User.create(req.body)
            res.json(newUser)
        } else {
            throw new Error("User Already Exists")
        }
    }
)

// Loging User
const loginUser = errorHandler(async (req, res) => {
    const { email, password } = req.body
    const findUser = await User.findOne({ email: email })
    const refreshToken = generateRefreshToken(findUser?._id)
    const updateUserRefreshToken = await User.findOneAndUpdate(findUser._id, {
        "refreshToken": refreshToken
    })
    console.log(updateUserRefreshToken)
    if (updateUserRefreshToken) {
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
    }

    if (findUser && await findUser.isPasswordMached(password)) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            refreshToken: refreshToken,
            token: generteToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

// Handle Refresh Token
const handleRefreshToken = errorHandler(
    async (req, res) => {
        const cookie = req.cookies
        if (!cookie.refreshToken) throw new Error("No refresh Token")
        const refreshToken = cookie.refreshToken
        const user = await User.findOne({ refreshToken })
        if (!user) throw new Error('No refresh token passed db and not matched')
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) throw new Error('There something wrong with secret key')
        })
        const accessToken = generateRefreshToken(user?.id)
        res.json(accessToken)
    })

// Logout functionalty
const logout = errorHandler(
    async (req, res) => {
        const cookies = req.cookies
        if (!cookies.refreshToken) throw new Error('No refresh token in cookies')
        const refreshToken = cookies
        const user = await User.findOne({ refreshToken })
        if (!user) {
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true
            })
            res.sendStatus(204)
        }
        const updateUserRefreshToken = await User.findOneAndUpdate(refreshToken, {
            'refreshToken': ""
        })
        return res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204) //forbiden
    }
)


// Get all users
const getAllUsers = errorHandler(async (req, res) => {
    try {
        const allUser = await User.find()
        res.send(allUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Get single user
const getaUser = errorHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const singleUser = await User.findById(_id)
        res.json(singleUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Update User
const updateaUser = errorHandler(async (req, res) => {
    console.log(req.user)
    const { _id } = req.user
    try {
        const updateUser = await User.findOneAndUpdate(_id,
            {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            },
            {
                new: true
            }
        )
        res.json(updateUser)
    } catch (error) {
        throw new Error(error)
    }
})

// Delete User
const deleteaUser = errorHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteUser = await User.findByIdAndDelete(id)
        res.json(deleteUser)
    } catch (error) {
        throw new Error(error)
    }
})

const userBlock = errorHandler(
    async (req, res) => {
        const { id } = req.params
        try {
            const blocked = await User.findByIdAndUpdate(id,
                {
                    "isBlock": true
                }, {
                new: true
            })
            res.json(blocked)
        }
        catch (error) {
            throw new Error(error)
        }
    }
)

const userUnblock = errorHandler(
    async (req, res) => {
        const { id } = req.params

        try {
            const unBlocked = await User.findByIdAndUpdate(id, {
                "isBlock": false
            }, {
                new: true
            })
            res.json(unBlocked)
        }
        catch (error) {
            throw new Error(error)
        }
    }
)

const updatePassword = errorHandler(
    async (req, res) => {
        const { _id } = req.user
        const { password } = req.body
        // ObjectId.isValid(_id)
        const user = await User.findById(_id)
        if (password) {
            user.password = password
            const updatePassword = await user.save()
            res.json(updatePassword)
        } else {
            res.json(user)
        }
    }
)

const forgotPasswordToken = errorHandler(
    async (req, res) => {
        const { email } = req.body.email
        const user = await User.findOne(email)
        res.json(user)
    }
)

export {
    createUser,
    loginUser,
    getAllUsers,
    getaUser,
    updateaUser,
    deleteaUser,
    userBlock,
    userUnblock,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken
}