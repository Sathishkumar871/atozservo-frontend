import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import './Navbar.css'; 
import { FaShoppingCart, FaSearch, FaLeaf } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const context = useAppContext();

  if (!context) {
    throw new Error("Navbar must be used within an AppContextProvider");
  }

  const {
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
  } = context;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length > 0) {
      navigate("/products");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
      <Link to="/">
        <div className="flex items-center gap-2">
            <FaLeaf className="text-primary text-2xl" />
            <h2 className="text-2xl font-bold text-primary">Grocery App</h2>
        </div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <Link to={"/"}>Home</Link>
        <Link to={"/products"}>All Products</Link>

        {/* Search Box */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={handleSearchChange}
            value={searchQuery}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <FaSearch className="text-gray-500" />
        </div>

        {/* Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <FaShoppingCart className="text-primary text-2xl" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="flex items-center gap-6 md:hidden">
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
          <FaShoppingCart className="text-primary text-2xl" />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
          className="sm:hidden"
        >
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#426287"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}
      >
        <Link onClick={() => setIsMenuOpen(false)} to={"/"}>
          Home
        </Link>
        <Link onClick={() => setIsMenuOpen(false)} to={"/products"}>
          Products
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;