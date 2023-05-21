import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, require: true },
    slug: { type: String, unique: true, lowerCase: true, require: true },
    discription: { type: String },
    price: { type: Number, require: true },
    category: { type: String},
    quantity: { type: Number, require: true },
    image: { type: Array },
    color: { enum: ['red', 'black', 'brown'] },
    rating: [{ Star: Number }],
    postedby: { type: mongoose.Types.ObjectId, ref: 'user' },
    brand: { enum: ['samsung', 'apple', 'nokia'] },
    sold: { type: Number, default: 0 },
}, {
    timestamps: true
})

export default mongoose.model('products', productSchema)