import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios, { AxiosInstance } from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// 1. Define Interfaces for type safety
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
  description: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CartItems {
  [key: string]: number;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  cart: CartItems;
}

interface AppContextType {
  navigate: ReturnType<typeof useNavigate>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isSeller: boolean;
  setIsSeller: React.Dispatch<React.SetStateAction<boolean>>;
  showUserLogin: boolean;
  setShowUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[];
  cartItems: CartItems;
  addToCart: (itemId: string) => void;
  updateCartItem: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  cartCount: () => number;
  totalCartAmount: () => number;
  axios: AxiosInstance;
  fetchProducts: () => Promise<void>;
  setCartItems: React.Dispatch<React.SetStateAction<CartItems>>;
}

export const AppContext = createContext<AppContextType | null>(null);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isSeller, setIsSeller] = useState<boolean>(false);
  const [showUserLogin, setShowUserLogin] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; message: string }>("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch (error) {
      setIsSeller(false);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; message: string; user: User }>("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cart);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching user data.");
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get<{ success: boolean; message: string; products: Product[] }>("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching products.");
    }
  };

  const addToCart = (itemId: string) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success(`Cart updated`);
  };

  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += cartItems[itemId] * itemInfo.offerPrice;
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  const removeFromCart = (itemId: string) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
      setCartItems(cartData);
      toast.success(`Removed from cart`);
    }
  };

  useEffect(() => {
    fetchSeller();
    fetchProducts();
    fetchUser();
  }, []);

  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post<{ success: boolean; message: string }>("/api/cart/update", { cartItems });
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to update cart on the server.");
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems, user]); // Added 'user' to dependencies to avoid unnecessary calls

  const value: AppContextType = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    setCartItems,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
export default AppContextProvider;