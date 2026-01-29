import React, { useContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from "./pages/Home";
import Products from './pages/Products';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Navbar from './components/Navbar';
import { AppContext } from './context/AppContext';
import MyOrders from './pages/MyOrders';
import Auth from './models/Auth';
import ProductCategory from './pages/ProductCategory';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import AddAddess from './pages/AddAddess';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';


const App = () => {
  const { isSeller, showUserLogin } = useContext(AppContext);
  const location = useLocation(); // ✅ FIXED: added useLocation
  const isSellerPath = location.pathname.includes('seller');

  return (
    <div className="text-default min-h-screen">
      {!isSellerPath && <Navbar />}
      {showUserLogin && <Auth />}
      <Toaster />
      <div className="px-6 md:px-12 lg:px-18 xl:px-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category/:_id" element={<ProductDetails />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/add-address" element={<AddAddess />} />

          {/* ✅ Seller Section */}
          <Route path="/seller" element={isSeller ? <SellerLayout /> : <SellerLogin />} >
          <Route index element={isSeller ? <AddProduct /> : <SellerLogin />} />
          <Route path="/seller/product-list" element={isSeller ? <ProductList /> : <SellerLogin />} />
          <Route path="/seller/orders" element={isSeller ? <Orders /> : <SellerLogin />} />
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;