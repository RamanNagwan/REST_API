import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import crypto from 'crypto-js'

const userSchema = new mongoose.Schema({
    firstname: { type: String, require: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    mobile: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    role: { type: String, default: "user" },
    isBlock: { type: Boolean, default: false },
    cart: { type: Array, default: [] },
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: { type: String },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date }
},
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.isPasswordMached = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createResetPasswordToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000   // after 10 mintes expire
    return resetToken
}

export default mongoose.model('users', userSchema)