import mongoose from "mongoose";


export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB Connected")
    }catch(error){
        console.error("Error Connecting to MongoDB :", error)
    }
}