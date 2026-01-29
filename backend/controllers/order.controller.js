import Order from "../models/order.model.js"
import Product from "../models/product.model.js"


// place Order COD :/api/order/cod
export const placeOrderCOD = async(req,res)=>{
    try {
        const userId = req.user;
        const {items, address} = req.body;
        if(! items || ! address){
            return res.status(400).json({message:"Items and address are required"});
        }

        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc)+ product.offerPrice * item.quantity;
        },0)

        // Add tax charge 2%
        amount += Math.floor((amount *2)/100);
        await Order.create({
            userId,
            items,
            address,
            amount,
            paymentType: "COD",
            isPaid: false,
        });
        res.status(201).json({
            message:"Order placed Successfully",
            success:true,
        })
    } catch (error) {
        console.log("Error Placing Order :",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

// order details for indivisual user :/api/order/user
export const getUserOrders = async(req,res)=>{
    try {
        const userId = req.user;
        const orders = await Order.find({
            userId,
            $or:[{paymentType:"COD"}, {isPaid:true}],
        }).populate("items.product address").sort({createdAt : -1});
        res.status(200).json({
            success:true,
            orders,
        });
    } catch (error) {
        console.log("Error Placing Order :",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

// get all order for admin :/api/order/seller
export const getAllOrders = async(req,res)=>{
    try {
        const orders=await Order.find({
            $or :[{paymentType: "COD" }, {isPaid: true}],
        })
        .populate("items.product address")
        .sort({createdAt: -1});
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.log("Error Placing Order :",error)
        res.status(500).json({message:"Internal Server Error"})
    }
}