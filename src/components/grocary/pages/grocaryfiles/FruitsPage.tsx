import React, { useState, useMemo } from "react";
import ProductCard from "../ProductCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FruitsPage.css";

const SingleBanner = () => {
  return (
    <div className="banner-container">
      <div className="banner-content">
        <h1 className="banner-title">Organic <br/> Healthy Fresh <br/> Food For You.</h1>
        <p className="banner-subtitle">
          There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.
        </p>
        <button className="banner-button">Order Now →</button>
      </div>
      <div className="banner-image-container">
        <img src="https://i.imgur.com/k9b64Bf.png" alt="Organic Fresh Food" className="banner-image" />
      </div>
    </div>
  );
};

const FruitsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  const fruitsData = [
    { id: 1, name: "Red Apple", price: 180, unit: "kg", image: ["https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 150, _id: "1" },
    { id: 2, name: "Cavendish Banana", price: 60, unit: "dozen", image: ["https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 55, _id: "2" },
    { id: 3, name: "Nagpur Orange", price: 90, unit: "kg", image: ["https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: false, category: "Fruits", offerPrice: 80, _id: "3" },
    { id: 4, name: "Alphonso Mango", price: 500, unit: "dozen", image: ["https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 450, _id: "4" },
    { id: 5, name: "Thompson Grapes", price: 120, unit: "kg", image: ["https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 110, _id: "5" },
    { id: 6, name: "Mahabaleshwar Strawberry", price: 250, unit: "box", image: ["https://images.pexels.com/photos/1132558/pexels-photo-1132558.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 220, _id: "6" },
    { id: 7, name: "Watermelon", price: 40, unit: "kg", image: ["https://images.pexels.com/photos/1313267/pexels-photo-1313267.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: false, category: "Fruits", offerPrice: 35, _id: "7" },
    { id: 8, name: "Pineapple", price: 70, unit: "piece", image: ["https://images.pexels.com/photos/103566/pexels-photo-103566.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 65, _id: "8" },
    { id: 9, name: "Pomegranate", price: 200, unit: "kg", image: ["https://images.pexels.com/photos/5946081/pexels-photo-5946081.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 180, _id: "9" },
    { id: 10, name: "Kiwi", price: 150, unit: "box", image: ["https://images.pexels.com/photos/86734/pexels-photo-86734.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 135, _id: "10" },
    { id: 11, name: "Guava", price: 80, unit: "kg", image: ["https://images.pexels.com/photos/3932829/pexels-photo-3932829.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 75, _id: "11" },
    { id: 12, name: "Papaya", price: 50, unit: "piece", image: ["https://images.pexels.com/photos/4022833/pexels-photo-4022833.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 45, _id: "12" },
    { id: 13, name: "Dragon Fruit", price: 300, unit: "piece", image: ["https://images.pexels.com/photos/40842/fruit-dragon-fruit-tropical-exotic-40842.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 280, _id: "13" },
    { id: 14, name: "Lychee", price: 150, unit: "kg", image: ["https://images.pexels.com/photos/6102142/pexels-photo-6102142.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 140, _id: "14" },
    { id: 15, name: "Cherry", price: 600, unit: "box", image: ["https://images.pexels.com/photos/39803/pexels-photo-39803.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 550, _id: "15" },
    { id: 16, name: "Muskmelon", price: 60, unit: "piece", image: ["https://images.pexels.com/photos/5431109/pexels-photo-5431109.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 50, _id: "16" },
    { id: 17, name: "Custard Apple (Seethaphal)", price: 120, unit: "kg", image: ["https://images.pexels.com/photos/2260485/pexels-photo-2260485.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 100, _id: "17" },
    { id: 18, name: "Jackfruit", price: 80, unit: "kg", image: ["https://images.pexels.com/photos/2898144/pexels-photo-2898144.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 70, _id: "18" },
    { id: 19, name: "Sapodilla (Sapota)", price: 50, unit: "kg", image: ["https://images.pexels.com/photos/11059437/pexels-photo-11059437.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 45, _id: "19" },
    { id: 20, name: "Amla (Gooseberry)", price: 70, unit: "kg", image: ["https://images.pexels.com/photos/1014107/pexels-photo-1014107.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 60, _id: "20" },
    { id: 21, name: "Avocado", price: 250, unit: "piece", image: ["https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 220, _id: "21" },
    { id: 22, name: "Figs (Anjeer)", price: 350, unit: "kg", image: ["https://images.pexels.com/photos/5063001/pexels-photo-5063001.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 320, _id: "22" },
    { id: 23, name: "Blackberry", price: 400, unit: "box", image: ["https://images.pexels.com/photos/5211933/pexels-photo-5211933.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 380, _id: "23" },
    { id: 24, name: "Jamun", price: 100, unit: "kg", image: ["https://images.pexels.com/photos/5475141/pexels-photo-5475141.jpeg?auto=compress&cs=tinysrgb&w=600"], inStock: true, category: "Fruits", offerPrice: 90, _id: "24" },
  ];

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const filteredFruits = useMemo(() => {
    let filtered = fruitsData.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortOrder === "asc") {
      return [...filtered].sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "desc") {
      return [...filtered].sort((a, b) => b.offerPrice - a.offerPrice);
    }
    return filtered;
  }, [searchTerm, sortOrder]);

  return (
    <div className="fruits-page">
      <SingleBanner />
      <h2 className="section-title">Featured Products</h2>
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search Fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>
              ❌
            </button>
          )}
        </div>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>
      <div className="fruits-grid">
        {filteredFruits.length > 0 ? (
          filteredFruits.map(fruit => (
            <ProductCard
              key={fruit._id}
              product={{
                ...fruit,
                image: fruit.image,
                _id: fruit._id,
                category: fruit.category,
                price: fruit.price,
                offerPrice: fruit.offerPrice,
                inStock: fruit.inStock,
              }}
            />
          ))
        ) : (
          <p className="no-results">❌ No fruits found</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default FruitsPage;