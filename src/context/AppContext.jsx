import { createContext ,useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials= true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast"
// import {AppContext} from './AppContext';


export const AppContext=createContext(null);

const AppContextProvider=({children})=>{
    const navigate = useNavigate();
    const [user,setUser]=useState(null);
    const [isSeller,setIsSeller]=useState(null);
    const [showUserLogin, setShowUserLogin]= useState(false);
    const [products, setProducts] =useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery]= useState({});
    


    // check seller status
    const fetchSeller = async()=>{
        try{
            const {data}= await axios.get("/api/is-auth");
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    // check user status
    const fetchUser = async()=>{
        try {
            const{data} = await axios.get("/api/user/is-auth");
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cart);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // fetch all product data 
    const fetchProducts = async()=>{
        // setProducts(dummyProducts)
        try {
            const {data} = await axios.get("/api/product/list");
            
            if(data.success){
                setProducts(data.products);
                
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    // Add product to cart
    const addToCart=(itemId)=>{
        let cartData = structuredClone(cartItems|| {});
        if(cartData[itemId]){
            cartData[itemId] +=1;
        }else{
            cartData[itemId]=1;
        }
        setCartItems(cartData)
        toast.success("added to cart");
    }


    // Update cart item quantity
    const updateCartItem=(itemId, quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId] =quantity;
        setCartItems(cartData);
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
            setCartItems(cartData);
        }
    }

    useEffect(()=>{
        const updateCart = async()=>{
            try {
                const {data}= await axios.post("/api/cart/update",{cartItems});
                if(!data.success){
                toast.error(data.message);
            }
            } catch (error) {
                toast.error(error.message);
            }
        };
        if(user){
            updateCart();
        }
    },[cartItems])


    useEffect(()=>{
        fetchProducts();
        fetchSeller();
        fetchUser();
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
        fetchProducts,
        setCartItems
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