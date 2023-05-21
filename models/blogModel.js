import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    category: { type: String, require: true },
    numberViews: { type: Number, deafult: 0 },

    isLikes: { type: Boolean, deafult: false },
    likeUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

    isDislikes: { type: Boolean, deafult: false },
    disLikedUserId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],

    image: { type: String, deafult: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97hABfysd1JF4Nk5Cz0KYF8XqFWf2i1PdnncsrWoOwOMVB4fCBMZ2mWlCIeDOsmZBj_o&usqp=CAU" },
    author: { type: String, deault: "admin" },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
})

export default mongoose.model('blog', blogSchema)