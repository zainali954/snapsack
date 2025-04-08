import mongoose from "mongoose"

const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb connected to: ${conn.connection.host}`)
    } catch (error) {
        console.error("Error connecting to mongoDb: ", error)
        process.exit(1)
    }
}

export default connectDB;