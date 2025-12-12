import { createContext ,useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast"



export const AppContext=createContext(null);

const AppContextProvider=({children})=>{
    const navigate = useNavigate();
    const [user,setUser]=useState(null);
    const [isSeller,setIsSeller]=useState(null);
    const [showUserLogin, setShowUserLogin]= useState(false);
    const [products, setProducts] =useState([]);
    const [cartItems, setCardItems]= useState({});
    const [searchQuery, setSearchQuery]= useState({});
    
    // fetch all product data 
    const fetchProducts = async()=>{
        setProducts(dummyProducts)
    };
    // Add product to cart
    const addToCart=(itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] +=1;
        }else{
            cartData[itemId]=1;
        }
        setCardItems(cartData)
        toast.success("added to cart");
    }


    // Update cart item quantity
    const updateCartItem=(itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] =quantity;
        setCardItems(cartData);
        toast.success("cart updated")
    }
    // total cart item
    const cartCount=()=>{
        let totalCount =0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }
    // total cart amount
    const totalCartAmount=()=>{
        let totalAmount=0;
        for(const items in cartItems){
            let itemInfo=products.find((product)=>product._id===items);
            if(cartItems[items]>0){
                totalAmount += cartItems[items]*itemInfo.offerPrice;
            }
        }
        return Math.floor(totalAmount *100)/100;
    }

    // Remove product from cart
    const removeFromCart=(itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId] -=1;
            if(cartData[itemId] ===0){
                delete cartData[itemId];
            }
            toast.success("Removed from cart");
            setCardItems(cartData);
        }
    }
    useEffect(()=>{
        fetchProducts();
    },[])


    const value={
        navigate,
        user,
        axios,
        setUser,
        isSeller,
        setIsSeller,
        showUserLogin,
        setShowUserLogin,
        products,
        setProducts,
        addToCart,
        updateCartItem,
        cartCount,
        totalCartAmount,
        removeFromCart,
        cartItems,
        searchQuery,
        setSearchQuery,
        };
    return(
        <>
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
        </>
    )
}
export default AppContextProvider;
export const useAppContext = () => useContext(AppContext);