import { useEffect, useState } from "react";
import { useAppContext } from "./context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "./assets/assets";
import ProductCard from "./pages/ProductCard";

// Assuming the Product interface is defined in appContext.tsx
// If not, you should define it here or in a separate types file.
interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
  description: string[];
  rating?: number; // Added rating, assuming it's a number
  inStock: boolean;
}

// Define the type for the URL parameters
interface ProductParams {
  id: string;
}

const SingleProduct = () => {
  // Use a type guard to ensure the context is not null
  const context = useAppContext();
  if (!context) {
    throw new Error("SingleProduct must be used within an AppContextProvider");
  }
  const { products, navigate, addToCart } = context;

  // Type the useParams hook
  const { id } = useParams<ProductParams>();

  // Type the state variables
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Find the product and assert its type
  const product = products.find((p) => p._id === id);

  // Set thumbnail and related products
  useEffect(() => {
    if (products.length > 0 && product) {
      setThumbnail(product.image[0] || null);
      let productsCopy = products.slice();
      // Corrected logic to filter for products in the same category
      productsCopy = productsCopy.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products, product]);

  return (
    product && (
      <div className="mt-16">
        <p>
          <Link to="/">Home</Link>/<Link to={"/products"}> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img
                    src={`http://localhost:5000/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              {thumbnail && (
                <img
                  src={`http://localhost:5000/images/${thumbnail}`}
                  alt="Selected product"
                />
              )}
            </div>
          </div>

          <div className="text-sm w-full md:w-1/2">
            <h1 className="text-3xl font-medium">{product.name}</h1>
            <div className="flex items-center gap-0.5 mt-1">
              {/* Added a safe check for rating */}
              {Array(5)
                .fill("")
                .map((_, i) => (
                  <img
                    src={
                      (product.rating || 0) > i
                        ? assets.star_icon
                        : assets.star_dull_icon
                    }
                    alt="star"
                    key={i}
                    className="w-3.5 md:w-4"
                  />
                ))}
              <p className="text-base ml-2">(4)</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: ${product.price}
              </p>
              <p className="text-2xl font-medium">MRP: ${product.offerPrice}</p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc: string, index: number) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex items-center mt-10 gap-4 text-base">
              <button
                onClick={() => addToCart(product._id)}
                className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  addToCart(product._id);
                  navigate("/cart");
                  window.scrollTo(0, 0);
                }}
                className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
        {/* related prodcuts  */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
            {relatedProducts
              .filter((p) => p.inStock)
              .map((p, index) => (
                <ProductCard key={index} product={p} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              window.scrollTo(0, 0);
            }}
            className="w-1/2 my-8 py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};

export default SingleProduct;