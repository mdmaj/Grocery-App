import Product from '../models/product.model.js';




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

        const image= req.files?.map((file)=> file.filename);
        if(
            !name || 
            !price || 
            !offerPrice || 
            !description || 
            !category || 
            !image || 
            image.length ===0){
            return res.status(400).json({
                success: false,
                message :"All Fields including images are required",
            });
        }
        

        await Product.create({
            name,
            description,
            price,
            offerPrice,
            category,
            image,
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