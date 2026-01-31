import Product from '../models/product.model.js';
import { v2 as cloudinary } from 'cloudinary';

// add Product :/api/product/add-product
export const addProduct = async (req,res)=>{
    try {
        const {
            name, 
            description, 
            price,
            offerPrice, 
            category
        } = req.body;

        if(
            !name || 
            !price || 
            !offerPrice || 
            !description || 
            !category || 
            !req.files || 
            req.files.length ===0){
            return res.status(400).json({
                success: false,
                message :"All Fields including images are required",
            });
        }

        // Upload images to Cloudinary
        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'grocery-products', // Optional: organize images in a folder
                        resource_type: 'image'
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result.secure_url); // Store the Cloudinary URL
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });
        });

        const imageUrls = await Promise.all(uploadPromises);

        await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image: imageUrls, // Store Cloudinary URLs instead of filenames
        })

        res.status(201).json({message: "Product added Successfully", success: true});
    } catch (error) {
        res.status(500).json({message:"Server Error", error : error.message})
    }
}

// get Products :/api/product/get

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};



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