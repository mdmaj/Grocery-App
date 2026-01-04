import Product from '../models/product.model.js';
import {v2 as cloudinary} from "cloudinary";



// add Product :/api/product/add 
export const addProduct = async (req,res)=>{
    try {
        const {name, description, price, offerPrice, category} = req.body;

        const images= req.files;

        let imageUrl = await Promise.all(
            images.map(async (item) =>{
                let result = await cloudinary.uploader.upload(item.path,{
                    resource_type :"image",
                });
                return result.secure_url;
            })
        );

        await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image: imageUrl,
        })

        res.status(201).json({message: "Product added Successfully", success: true});
    } catch (error) {
        res.status(500).json({message:"Server Error", error : error.message})
    }
}

// get Products :/api/product/get

export const getProduct = async(req,res)=>{
    try {
        const products = (await Product.find({})).toSorted({createdAt : -1});
        res.status(200).json({products, success:true})
    } catch (error) {
        res.status(500).json({message:"Server Error", error : error.message})
    }
}


// get single Product  :/api/product/id
export const getProductById = async (req,res)=>{
    try {
        const {id} = req.body;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found", success:false});
        }
        res.status(200).json({product, success:true})
    } catch (error) {
        res.status(500).json({message:"Server Error", error : error.message})
    }
}

// change stock : /api/product/stock

export const changeStock = async(req,res)=>{
    try {
        const {id,inStock} = req.body;
        const product = await Product.findByIdAndUpdate(id,{inStock}, {new:true});

        if(!product){
            return res.status(404).json({message:"Product not found", success: false})
        } 
        res.status(200).json({product, success:true, message: "Stock updated Successfully"})
    } catch (error) {
        res.status(500).json({message:"Server Error", error : error.message})
    }
}