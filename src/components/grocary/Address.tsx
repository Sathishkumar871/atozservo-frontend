import React, { useContext, useEffect, useState, ChangeEvent, FormEvent } from "react";
import { assets } from "./assets/assets";
import { AppContext } from "./context/AppContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

// 1. Define an interface for the address state object
interface AddressState {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

const Address = () => {
  // 2. Add type annotation for useState
  const [address, setAddress] = useState<AddressState>({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  // 3. Use a type guard for the context to ensure it's not null
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Address component must be used within an AppContextProvider");
  }
  const { axios, user, navigate } = context;

  // 4. Add type annotation for the event handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // 5. Add type annotation for the form submission event
  const submitHanlder = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const { data } = await axios.post<{ success: boolean; message: string }>("/api/address/add", {
        address,
      });

      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message || "An unexpected error occurred.");
      }
    }
  };

  // 6. Use useEffect for side effects like navigation
  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="mt-12 flex flex-col md:flex-row gap-6 p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Left Side: Address Fields */}
      <div className="flex-1 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Address Details
        </h2>
        <form
          onSubmit={submitHanlder}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Street</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">State</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Zip Code</label>
            <input
              type="number"
              name="zipCode"
              value={address.zipCode}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Country</label>
            <input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-600">Phone</label>
            <input
              type="number"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Image */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={assets.add_address_iamge}
          alt="Address Illustration"
          className="w-full max-w-xs rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default Address;