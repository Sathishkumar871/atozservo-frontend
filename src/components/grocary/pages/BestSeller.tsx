import React from "react";
import ProductCard from "./ProductCard";
import "./BestSeller.css"; 

// --- Dummy Products Data ---
const DUMMY_PRODUCTS = [
  {
    _id: "1",
    name: "Fresh Red Apples",
    category: "Fruits",
    price: 150,
    offerPrice: 120,
    image: [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=60"
    ],
    inStock: true,
  },
  {
    _id: "2",
    name: "Organic Fresh Milk",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: [
      "https://images.unsplash.com/photo-1550583724-b2692b85b210?auto=format&fit=crop&w=800&q=60"
    ],
    inStock: true,
  },
  {
    _id: "3",
    name: "Crunchy Potato Chips",
    category: "Snacks",
    price: 30,
    offerPrice: 28,
    image: [
      "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=60"
    ],
    inStock: true,
  },
  {
    _id: "4",
    name: "Sweet Mangoes",
    category: "Fruits",
    price: 120,
    offerPrice: 100,
    image: [
      "https://images.unsplash.com/photo-1594957688325-131709405b38?auto=format&fit=crop&w=800&q=60"
    ],
    inStock: true,
  },
  {
    _id: "5",
    name: "Farm Fresh Carrots",
    category: "Vegetables",
    price: 50,
    offerPrice: 45,
    image: [
      "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=60"
    ],
    inStock: true,
  },
];

const BestSeller = () => {
  return (
    <div className="bestseller-section">
      <div className="bestseller-header">
        <h2 className="bestseller-title">Best Sellers</h2>
        <button className="bestseller-see-all-btn">See all</button>
      </div>
      <div className="bestseller-list">
        {DUMMY_PRODUCTS.filter((p) => p.inStock).map((product) => (
          <div key={product._id} className="bestseller-item-wrapper">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSeller;
