import React from "react";
import { useAppContext } from "../context/AppContext";
import "./ProductCard.css";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

interface AppContextType {
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  cartItems: { [key: string]: number };
  navigate: (path: string) => void;
}

const DUMMY_ASSETS = {
  star_icon:
    "https://ik.imagekit.io/pimx50ija/star_icon.svg?updatedAt=1757487483345",
  star_dull_icon:
    "https://ik.imagekit.io/pimx50ija/star_dull_icon.svg?updatedAt=1757487561522",
  cart_icon:
    "https://ik.imagekit.io/pimx50ija/cart_icon.svg?updatedAt=1757437097739",
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate } =
    useAppContext() as AppContextType;

  const discount = Math.round(
    ((product.price - product.offerPrice) / product.price) * 100
  );

  return (
    <div
      className="product-card"
      onClick={() => {
        navigate(`/product/${product.category.toLowerCase()}/${product._id}`);
        window.scrollTo(0, 0);
      }}
    >
      <div className="product-card-image-wrapper">
        {discount > 0 && (
          <span className="discount-badge">-{discount}% OFF</span>
        )}
        <img
          className="product-card-image"
          src={product.image[0]}
          alt={product.name}
        />
      </div>

      <div className="product-card-details">
        <p className="product-card-category">{product.category}</p>
        <p className="product-card-name">{product.name}</p>

        <div className="product-card-rating">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <img
                key={i}
                src={i < 4 ? DUMMY_ASSETS.star_icon : DUMMY_ASSETS.star_dull_icon}
                alt="rating"
                className="rating-star"
              />
            ))}
          <p>(4)</p>
        </div>

        <div className="product-card-price-section">
          <p className="product-card-price">
            ₹{product.offerPrice}
            <span className="product-card-old-price">₹{product.price}</span>
          </p>

          <div
            className="add-to-cart-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            {!cartItems?.[product._id] ? (
              <button
                onClick={() => addToCart(product._id)}
                className="add-to-cart-btn"
              >
                <img src={DUMMY_ASSETS.cart_icon} alt="cart icon" />
                Add
              </button>
            ) : (
              <div className="quantity-control">
                <button
                  onClick={() => removeFromCart(product._id)}
                  className="quantity-btn-minus"
                >
                  -
                </button>
                <span className="quantity-display">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => addToCart(product._id)}
                  className="quantity-btn-plus"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
