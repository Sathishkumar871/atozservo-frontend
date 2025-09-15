/*import { categories } from "./assets/assets";
import ProductCard from "./pages/ProductCard";
import { AppContext } from "./context/AppContext";
import { useParams } from "react-router-dom";
import { Product } from "./context/AppContext";

interface CategoryParams {
  category: string;
}

const ProductCategory = () => {
  
  const context = useAppContext();
  if (!context) {
    throw new Error("ProductCategory must be used within an AppContextProvider");
  }
  const { products } = context;
  
  
  const { category } = useParams<CategoryParams>();
  
  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category?.toLowerCase()
  );

  const filteredProducts = products.filter(
    (product: Product) => product.category.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-3xl md:text-4xl font-medium">
            {searchCategory.text.toUpperCase()}
          </h1>
        </div>
      )}
      
      {filteredProducts.length > 0 ? (
        <div>
          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product._id} product={product} /> 
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl md:text-4xl font-medium">
            No products found
          </h1>
        </div>
      )}
    </div>
  );
};
export default ProductCategory;*/