import React, { useState, useEffect, FormEvent } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import { AxiosError } from "axios";

// AppContext లో ఉండాల్సిన ప్రాపర్టీల కోసం ఒక ఇంటర్‌ఫేస్‌
interface AppContextType {
  isSeller: boolean;
  setIsSeller: (isSeller: boolean) => void;
  navigate: (path: string) => void;
  axios: any; // మీరు axiosని ఎలా కాన్ఫిగర్ చేశారో తెలియదు, కాబట్టి ప్రస్తుతానికి 'any' వాడతాను.
}

const SellerLogin: React.FC = () => {
  // useAppContext hookని ఉపయోగించి, దాని టైప్‌నుAppContextType గా మార్చాను
  const { isSeller, setIsSeller, navigate, axios } = useAppContext() as AppContextType;

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to login");
      }
    }
  };

  return (
    !isSeller && (
      <div className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center bg-black/50 text-gray-600">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
        >
          <p className="text-2xl font-medium m-auto">
            <span className="text-indigo-500">Seller</span>
            Login
          </p>

          <div className="w-full ">
            <p>Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="email"
              required
            />
          </div>
          <div className="w-full ">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="password"
              required
            />
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </form>
      </div>
    )
  );
};

export default SellerLogin;