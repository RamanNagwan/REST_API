import express from 'express'
import { authmiddleware, isAdmin } from '../middlewares/authMiddleware.js'
import {
    createUser,
    deleteaUser,
    getaUser,
    getAllUsers,
    loginUser,
    updateaUser,
    userBlock,
    userUnblock,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken
} from '../controllers/userController.js'

const router = express.Router()

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', forgotPasswordToken)
router.put('/password',authmiddleware, updatePassword)
router.get('/:id', authmiddleware, isAdmin, getaUser)
router.put('/edit-user',authmiddleware, updateaUser)
router.delete('/:id', deleteaUser)
router.put('/block-user/:id',authmiddleware, isAdmin, userBlock)
router.put('/unblock-user/:id', authmiddleware,isAdmin, userUnblock)

export default router
