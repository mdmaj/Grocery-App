import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB.js ';
dotenv.config();

import userRoutes from "./routes/user.routes.js"

const app = express();

// Connect DataBase
connectDB();
// connect frontent to backend
const allowedOrigin = ["https://localhost:5173"];

// middlewares
app.use(express.json());
app.use(cors({origin : allowedOrigin, credentials: true}))
app.use(cookieParser());

// API Endpoints
app.get('/', (req,res)=>{
    res.send("hello World")
})
app.use("/api/user", userRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    console.log(`Server is Listing On Port ${PORT}`)
})