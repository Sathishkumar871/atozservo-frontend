import { useContext, useEffect, useState } from "react";
import { AppContext } from "./context/AppContext";
import toast from "react-hot-toast";
import { AxiosError, AxiosResponse } from "axios";

// 1. Define interfaces for the data structure
interface Product {
  _id: string;
  name: string;
  category: string;
  image: string[];
  offerPrice: number;
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  amount: number;
  paymentType: string;
  status: string;
  createdAt: string;
}

const MyOrders = () => {
  // 2. Add type annotation for the state variable
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  // 3. Use a type guard for the context
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("MyOrders component must be used within an AppContextProvider");
  }
  const { axios, user } = context;

  const fetchOrders = async () => {
    try {
      // 4. Add type annotation for the axios response
      const { data }: AxiosResponse<{ success: boolean; message: string; orders: Order[] }> =
        await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      // 5. Improved error handling with AxiosError
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, axios]); // Added axios to the dependency array

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.map((order) => (
        <div
          key={order._id} // Use a unique ID as the key, not the index
          className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
        >
          <p className="flex justify-between items-center gap-6 ">
            <span>orderId: {order._id} </span>
            <span>payment: {order.paymentType} </span>
            <span>Total Amount: ${order.amount} </span>
          </p>
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`relative bg-white text-gray-800/70 ${
                order.items.length !== index + 1 && "border-b"
              } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 w-full max-w-4xl`}
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="p-4 rounded-lg">
                  <img
                    src={`http://localhost:5000/images/${item.product.image[0]}`}
                    alt={item.product.name}
                    className="w-16 h-16"
                  />
                </div>

                <div className="ml-4">
                  <h2 className="text-xl font-medium">{item.product.name}</h2>
                  <p>{item.product.category}</p>
                </div>
              </div>

              <div className=" text-lg font-medium">
                <p>Quantity: {item.quantity || "1"}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <p className=" text-lg">
                Amount: ${item.product.offerPrice * item.quantity}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;