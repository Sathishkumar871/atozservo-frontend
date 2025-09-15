import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets, dummyOrders } from "../assets/assets";
import toast from "react-hot-toast";
import axios, { AxiosResponse } from "axios";

// 1. Define interfaces for type safety
interface Product {
  _id: string;
  name: string;
  image: string[];
}

interface OrderItem {
  product: Product;
  quantity: number;
}

interface Address {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  address: Address;
  amount: number;
  paymentType: string;
  orderDate: string;
  isPaid: boolean;
}

const Orders = () => {
  const boxIcon =
    "https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/e-commerce/boxIcon.svg";

  // 2. Add type annotation for useState
  const [orders, setOrders] = useState<Order[]>([]);

  // 3. Use a type guard for the context
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Orders component must be used within an AppContextProvider");
  }
  const { axios } = context;

  const fetchOrders = async () => {
    try {
      const { data }: AxiosResponse<{ success: boolean; message: string; orders: Order[] }> =
        await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="md:p-10 p-4 space-y-4">
      <h2 className="text-lg font-medium">Orders List</h2>
      {orders.map((order, index) => (
        <div
          key={order._id} // Use a unique ID for the key, not the index
          className="flex flex-col md:grid md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center gap-5 p-5 max-w-4xl rounded-md border border-gray-300 text-gray-800"
        >
          <div className="flex gap-5">
            <img
              className="w-12 h-12 object-cover opacity-60"
              src={`http://localhost:5000/images/${order.items[0]?.product.image[0]}`}
              alt="boxIcon"
            />
            <>
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex flex-col justify-center">
                  <p className="font-medium">
                    {item.product.name}{" "}
                    <span
                      className={`text-indigo-500 ${
                        item.quantity < 2 && "hidden"
                      }`}
                    >
                      x {item.quantity}
                    </span>
                  </p>
                </div>
              ))}
            </>
          </div>

          <div className="text-sm">
            <p className="font-medium mb-1">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>
              {order.address.street}, {order.address.city},{" "}
              {order.address.state},{order.address.zipcode},{" "}
              {order.address.country}
            </p>
          </div>

          <p className="font-medium text-base my-auto text-black/70">
            ${order.amount}
          </p>

          <div className="flex flex-col text-sm">
            <p>Method: {order.paymentType}</p>
            <p>Date: {order.orderDate}</p>
            <p>Payment: {order.isPaid ? "Paid" : "Pending"}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default Orders;