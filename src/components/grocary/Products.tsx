import { useState, useEffect } from "react";
import ProductCard from "./pages/ProductCard";
import { useAppContext } from "./context/AppContext";

// Assuming the Product interface is defined in appContext.tsx
// If not, you should define it here or in a types file.
interface Product {
  _id: string;
  name: string;
  inStock: boolean;
  // Add other properties of your product object here, e.g.:
  // category: string;
  // offerPrice: number;
  // image: string[];
}

const Products = () => {
  // Use a type guard for the context
  const context = useAppContext();
  if (!context) {
    throw new Error("Products component must be used within an AppContextProvider");
  }
  const { products, searchQuery } = context;

  // Type the state variable as an array of Product objects
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product: Product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16">
      <h1 className="text-3xl lg:text-4xl font-medium">All Products</h1>
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
        {filteredProducts
          .filter((product: Product) => product.inStock)
          .map((product: Product) => (
            // Use a unique ID for the key, not the index
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default Products;