import React, { useState } from 'react';
import './Grocery.css'; // దీనికి సంబంధించిన CSS ను కింద ఇచ్చాను
import { FaShoppingBasket, FaLeaf, FaGlassMartiniAlt, FaBolt, FaBoxOpen } from 'react-icons/fa';

// ఉదాహరణ డేటా (దీన్ని మీరు మీ API నుండి తెచ్చుకోవచ్చు)
const categories = [
  { name: 'Fruits & Veggies', icon: <FaLeaf />, color: '#2ecc71' },
  { name: 'Dairy & Bread', icon: <FaShoppingBasket />, color: '#f1c40f' },
  { name: 'Snacks & Drinks', icon: <FaGlassMartiniAlt />, color: '#e74c3c' },
];

const products = [
  { id: 1, name: 'Organic Apples', price: '₹180/kg', image: 'https://via.placeholder.com/150/92c952' },
  { id: 2, name: 'Fresh Milk', price: '₹60/L', image: 'https://ik.imagekit.io/pimx50ija/a724040be383b8998f45c55442e26262.jpg?updatedAt=1755526347692' },
  { id: 3, name: 'Potato Chips', price: '₹30', image: 'https://via.placeholder.com/150/24f355' },
  { id: 4, name: 'Brown Bread', price: '₹45', image: 'https://via.placeholder.com/150/d32776' },
  { id: 5, name: 'Carrots', price: '₹50/kg', image: 'https://via.placeholder.com/150/f66b97' },
  { id: 6, name: 'Orange Juice', price: '₹90/L', image: 'https://via.placeholder.com/150/56a8c2' },
];


const Grocery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="grocery-container">
      {/* Header Section */}
      <header className="grocery-header">
        <FaShoppingBasket className="header-icon" />
        <h1>Grocery & Essentials</h1>
        <p>Fresh items delivered to your doorstep, faster than ever.</p>
      </header>

      {/* Special Services Section (Inspired by your request) */}
      <section className="special-services">
        <h2>Our Special Services</h2>
        <div className="services-grid">
          <div className="service-card express">
            <FaBolt className="service-icon" />
            <h3>Express Delivery</h3>
            <p>Get your items in under 30 minutes. Just like a private bike trip!</p>
          </div>
          <div className="service-card bulk">
            <FaBoxOpen className="service-icon" />
            <h3>Bulk Orders</h3>
            <p>For parties and monthly needs. Like booking a private transport!</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map(cat => (
            <div 
              key={cat.name} 
              className="category-card"
              onClick={() => setSelectedCategory(cat.name)}
              style={{ borderBottomColor: cat.color }}
            >
              <div className="category-icon" style={{ backgroundColor: cat.color }}>
                {cat.icon}
              </div>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section">
        <h2>Popular Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">{product.price}</p>
              </div>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Grocery;