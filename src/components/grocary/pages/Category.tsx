import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./Category.css";

// Static category data with images and bgColor
const CATEGORY_DATA = [
  {
    text: "Organic Veggies",
    path: "vegetables",
    image: "https://ik.imagekit.io/pimx50ija/organic_vegitable_image.png?updatedAt=1757439830837",
    bgColor: "#FEF6DA",
  },
  {
    text: "Fresh Fruits",
    path: "fruits",
    image: "https://ik.imagekit.io/pimx50ija/fresh_fruits_image.png?updatedAt=1757439868919",
    bgColor: "#FEE0E0",
  },
  {
    text: "Dairy Products",
    path: "dairy",
    image: "https://ik.imagekit.io/pimx50ija/yogurt_image_1.png?updatedAt=1757401094645",
    bgColor: "#FEE6CD",
  },
  {
    text: "Beverages",
    path: "alcohol",
    image: "https://ik.imagekit.io/pimx50ija/champagne-146885_1280.png?updatedAt=1757524865261",
    bgColor: "#FFF",
  },

  {
    text: "Snacks",
    path: "snacks",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    bgColor: "#FFF",
  },
  
  {
    text: "Meat & Fish",
    path: "meat-fish",
    image: "https://images.unsplash.com/photo-1594957688325-131709405b38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    bgColor: "#FEF6DA",
  },
];

const Category: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-16 px-4">
      <p className="text-2xl md:text-3xl font-medium">Categories</p>

      {/* Horizontal scrolling container */}
      <div className="my-6 category-scroll-container flex space-x-4 overflow-x-auto pb-2">
        {CATEGORY_DATA.map((category) => (
          <div
            key={category.path}
            className="category-card-item flex-shrink-0 w-40 rounded-lg p-3 cursor-pointer hover:shadow-lg transition"
            style={{ backgroundColor: category.bgColor }}
            onClick={() => {
        switch (category.path) {
       case "vegetables":
        navigate("/vegetables");
        break;
       case "fruits":
       navigate("/fruits");
       break;
       case "drinks":
       navigate("/drinks");
       break;
       case "grains":
       navigate("/grains");
       break;
       case "snacks":
       navigate("/snacks");
       break;
       case "alcohol":
       navigate("/alcohol");
       break;
      case "meat-fish":
      navigate("/meat-fish");
      break;
      default:
      navigate(`/products/${category.path}`);
      }
    window.scrollTo(0, 0);
     }}
          >
            <img
              src={category.image}
              alt={category.text}
              className="category-card-image w-full h-32 object-cover rounded"
            />
            <p className="category-card-text mt-2 text-center font-medium">{category.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
