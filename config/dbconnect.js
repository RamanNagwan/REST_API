import mongoose from "mongoose";

const dbConnection = async() => {
    try {
        const conn =await mongoose.connect(process.env.MONGODB_URL)
        console.log('connection successfully connected')
    } catch (error) {
        console.log(`connection error ${error}`)
    }
}

export default dbConnection