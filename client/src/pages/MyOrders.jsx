import React, { useEffect, useState ,useContext} from 'react'
import { dummyOrders } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const MyOrders = () => {

  const [myOrders, setMyOrders] = useState([]);
  const {axios, user}=useContext(AppContext);
  const fetchOrders = async () => {
    // setMyOrders(dummyOrders);
    try {
      const{data}=await axios.get("/api/order/user");
      // console.log("data", data);
      if(data.success){
        setMyOrders(data.orders);
      }else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  

  useEffect(() => {
    if(user){
      fetchOrders();
    }
  }, [user])

  return (
    <div className='mt-12 pb-16 px-4 md:px-0'>
      <div>
        <p className='text-2xl font-medium md:text-3xl'>
          My Orders
        </p>
      </div>

      {myOrders.map((order, index) => (
        <div 
          key={index} 
          className='my-8 border border-gray-300 rounded-lg p-4 md:p-6 w-full max-w-4xl'
        >
          {/* Order Header */}
          <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-6 mb-4'>
            <span className='text-sm md:text-base'>Order Id: {order._id}</span>
            <span className='text-sm md:text-base'>Payment: {order.paymentType}</span>
            <span className='text-sm md:text-base font-medium'>Total: ${order.amount}</span>
          </div>

          {/* Order Items */}
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 ${
                order.items.length !== idx + 1 ? "border-b" : ""
              }`}
            >
              {/* Product Image + Info */}
              <div className='flex items-center gap-4'>
                <img 
                  src={`http://localhost:8080/images/${item.product.image[0]}`}  
                  alt="Product" 
                  className='w-16 h-16 rounded-md object-cover'
                />
                <div>
                  <h2 className='text-lg font-medium'>{item.product.name}</h2>
                  <p className='text-gray-600 text-sm'>{item.product.category}</p>
                </div>
              </div>

              {/* Details */}
              <div className='text-sm md:text-base font-medium'>
                <p>Qty: {item.quantity}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>

              {/* Amount */}
              <p className='text-sm md:text-base font-semibold'>
                ${item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default MyOrders