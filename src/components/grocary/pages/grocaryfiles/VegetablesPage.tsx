import React, { useState, useMemo } from "react";
import "./VegetablesPage.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "../ProductCard"; 

const vegetables = [
{ _id: "1", name: "Spinach (Palakura)", price: 20, offerPrice: 18, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_36178515-stock-photo-baby-spinach-in-a-wooden.jpg?updatedAt=1757601715358"], inStock: true, category: "Leafy Greens" },

    { _id: "2", name: "Fenugreek Leaves (Menthikura)", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_40899091-stock-photo-methi-fenugreek-leaves.jpg?updatedAt=1757601812539"], inStock: true, category: "Leafy Greens" },

    { _id: "3", name: "Coriander Leaves (Kothimeera)", price: 20, offerPrice: 15, image: ["https://st2.depositphotos.com/1009329/9365/i/450/depositphotos_93650074-stock-photo-bunch-of-fresh-coriander-leaves.jpg"], inStock: true, category: "Leafy Greens" },

    { _id: "4", name: "Mint Leaves (Pudina)", price: 15, offerPrice: 12, image: ["https://st3.depositphotos.com/1491329/17955/i/450/depositphotos_179554566-stock-photo-bunch-fresh-green-mint-leaves.jpg"], inStock: true, category: "Leafy Greens" },

    { _id: "6", name: "Cabbage", price: 30, offerPrice: 25, image: ["https://st.depositphotos.com/1642482/3246/i/450/depositphotos_32466261-stock-photo-cabbage.jpg"], inStock: true, category: "Cruciferous" },

    { _id: "7", name: "Cauliflower", price: 40, offerPrice: 35, image: ["https://st5.depositphotos.com/29295588/76590/i/450/depositphotos_765908292-stock-photo-whole-cauliflower-accompanied-smaller-florets.jpg"], inStock: true, category: "Cruciferous" },

    { _id: "8", name: "Broccoli", price: 60, offerPrice: 50, image: ["https://st2.depositphotos.com/1036708/5570/i/450/depositphotos_55708775-stock-photo-broccoli.jpg"], inStock: true, category: "Cruciferous" },

    { _id: "9", name: "Bell Pepper (Capsicum)", price: 50, offerPrice: 45, image: ["https://static6.depositphotos.com/1081417/588/i/450/depositphotos_5887281-stock-photo-bell-pepper.jpg"], inStock: true, category: "Fruiting" },

    { _id: "10", name: "Onion", price: 25, offerPrice: 22, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_7535602-stock-photo-onion-on-a-white-background.jpg?updatedAt=1757602515011"], inStock: true, category: "Root" },

    { _id: "11", name: "Potato", price: 30, offerPrice: 28, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_4608734-stock-photo-potatoes-isolated-white-background.jpg?updatedAt=1757602605047"], inStock: true, category: "Root" },

    { _id: "12", name: "Tomato", price: 45, offerPrice: 40, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_823360754-stock-photo-ripe-red-tomato-isolated-white.jpg?updatedAt=1757602717913"], inStock: true, category: "Fruiting" },

    { _id: "13", name: "Carrot", price: 35, offerPrice: 30, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_666590410-stock-photo-three-carrot-vegetables-isolated-white.jpg?updatedAt=1757602779458"], inStock: true, category: "Root" },

    { _id: "14", name: "Radish", price: 20, offerPrice: 18, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_755615126-stock-photo-fresh-radish-isolated-white-background.jpg?updatedAt=1757602844830"], inStock: true, category: "Root" },

    { _id: "15", name: "Cucumber", price: 25, offerPrice: 22, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_217612572-stock-photo-cucumber-isolated-white-background.jpg?updatedAt=1757602932966"], inStock: true, category: "Gourd" },

    { _id: "16", name: "Zucchini", price: 40, offerPrice: 35, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_315172560-stock-photo-whole-and-slice-marrow-zucchini.jpg?updatedAt=1757603001498"], inStock: true, category: "Gourd" },

    { _id: "17", name: "Brinjal (Eggplant)", price: 30, offerPrice: 28, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_128223040-stock-photo-three-eggplants-and-parsley-sprigs.jpg?updatedAt=1757603082635"], inStock: true, category: "Fruiting" },

    { _id: "18", name: "Okra (Lady's Finger)", price: 35, offerPrice: 32, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_122097908-stock-photo-fresh-young-okra.jpg?updatedAt=1757603137360"], inStock: true, category: "Fruiting" },

    { _id: "19", name: "Green Beans", price: 40, offerPrice: 35, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_7541455-stock-photo-green-beans.jpg?updatedAt=1757603187301"], inStock: true, category: "Legume" },

    { _id: "20", name: "Garlic", price: 50, offerPrice: 45, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_204411092-stock-photo-garlic-isolated-on-white.jpg?updatedAt=1757603249750"], inStock: true, category: "Bulb" },

    { _id: "21", name: "Ginger", price: 60, offerPrice: 55, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_823360380-stock-photo-fresh-ginger-white-background.jpg?updatedAt=1757603329635"], inStock: true, category: "Root" },

    { _id: "22", name: "Corn", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_80542062-stock-photo-corn-on-the-cob-kernels.jpg?updatedAt=1757603456071"], inStock: true, category: "Grain" },

    { _id: "23", name: "Pumpkin", price: 30, offerPrice: 28, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_55993611-stock-photo-pumpkin.jpg?updatedAt=1757603549561"], inStock: true, category: "Gourd" },

    { _id: "24", name: "Sweet Potato", price: 45, offerPrice: 40, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_2363351-stock-photo-sweet-potatoes.jpg?updatedAt=1757603601640"], inStock: true, category: "Root" },

    { _id: "25", name: "Beetroot", price: 35, offerPrice: 30, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_215734520-stock-photo-red-beet-beetroot-slices-white.jpg?updatedAt=1757603669498"], inStock: true, category: "Root" },

    { _id: "26", name: "Lettuce", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_7699436-stock-photo-lettuce.jpg?updatedAt=1757603747869"], inStock: true, category: "Leafy Greens" },

    { _id: "35", name: "Chilli", price: 15, offerPrice: 12, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_57161367-stock-photo-chili-pepper.jpg?updatedAt=1757603968610"], inStock: true, category: "Fruiting" },

    { _id: "37", name: "Bitter Gourd (Kakarakaya)", price: 35, offerPrice: 30, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_690581378-stock-photo-bitter-gourd-sliced-isolated-white.jpg?updatedAt=1757604041173"], inStock: true, category: "Gourd" },

    { _id: "38", name: "Bottle Gourd (Sorakaya)", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_52901977-stock-photo-edible-green-calabash.jpg?updatedAt=1757604107282"], inStock: true, category: "Gourd" },

    { _id: "39", name: "Ridge Gourd (Beerakaya)", price: 30, offerPrice: 25, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_11915736-stock-photo-ridge-gourd.jpg?updatedAt=1757604159121"], inStock: true, category: "Gourd" },

    { _id: "40", name: "Cluster Beans (Goru Chikkudu)", price: 40, offerPrice: 35, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_89988530-stock-photo-cluster-beans-on-white-background.jpg?updatedAt=1757604218596"], inStock: true, category: "Legume" },

    { _id: "41", name: "Snake Gourd (Potlakaya)", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_151051304-stock-photo-fresh-snake-gourd-isolated-on.jpg?updatedAt=1757604273204"], inStock: true, category: "Gourd" },

    { _id: "42", name: "Drumstick (Munaga Kaya)", price: 30, offerPrice: 25, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_407174026-stock-photo-moringa-oleifera-isolated-white-background.jpg?updatedAt=1757604391704"], inStock: true, category: "Pod" },

    { _id: "44", name: "Lima Beans", price: 50, offerPrice: 45, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_80082750-stock-photo-lima-beans.jpg?updatedAt=1757604444016"], inStock: true, category: "Legume" },

    { _id: "45", name: "Mushrooms", price: 80, offerPrice: 70, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_168468326-stock-photo-champignons-and-green-parsley.jpg?updatedAt=1757604511935"], inStock: true, category: "Fungi" },

    { _id: "46", name: "Spring Onion", price: 20, offerPrice: 18, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_664985156-stock-photo-fresh-green-onions-isolated-white.jpg?updatedAt=1757604573845"], inStock: true, category: "Bulb" },

    { _id: "47", name: "Parsnip", price: 45, offerPrice: 40, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_791311500-stock-photo-many-raw-parsley-roots-isolated.jpg?updatedAt=1757604630218"], inStock: true, category: "Root" },

    { _id: "48", name: "Turnip", price: 30, offerPrice: 25, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_18952325-stock-photo-freshly-turnips.jpg?updatedAt=1757604692722"], inStock: true, category: "Root" },

    { _id: "49", name: "Capsicum (Yellow)", price: 55, offerPrice: 50, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_4722717-stock-photo-yellow-bell-peppers.jpg?updatedAt=1757604755592"], inStock: true, category: "Fruiting" },

    { _id: "50", name: "Capsicum (Red)", price: 60, offerPrice: 55, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_41446075-stock-photo-sweet-bell-pepper-isolated-on.jpg_updatedAt=1757604842360?updatedAt=1757604888578"], inStock: true, category: "Fruiting" },

    { _id: "51", name: "Broccoli Rabe", price: 65, offerPrice: 60, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_540779412-stock-photo-fresh-rapini-broccoli-rabe-isolated.jpg?updatedAt=1757605010684"], inStock: true, category: "Cruciferous" },

    { _id: "52", name: "Kohlrabi", price: 40, offerPrice: 35, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_1639115-stock-photo-three-green-kohlrabi.jpg?updatedAt=1757605086513"], inStock: true, category: "Cruciferous" },

    { _id: "58", name: "Taro Root (Arbi)", price: 40, offerPrice: 35, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_28422969-stock-photo-taro-roots-on-white.jpg?updatedAt=1757605507564"], inStock: true, category: "Tuber" },

    { _id: "59", name: "Yam", price: 50, offerPrice: 45, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_90616206-stock-photo-yam-isolated-on-white-background.jpg?updatedAt=1757605604749"], inStock: true, category: "Tuber" },

    { _id: "62", name: "Long Beans", price: 35, offerPrice: 30, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_53566093-stock-photo-long-beans.jpg?updatedAt=1757605706429"], inStock: true, category: "Legume" },

    { _id: "63", name: "Snow Peas", price: 50, offerPrice: 45, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_77625692-stock-photo-fresh-snow-peas.jpg?updatedAt=1757605795161"], inStock: true, category: "Legume" },

    { _id: "65", name: "Edamame", price: 60, offerPrice: 55, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_10733429-stock-photo-edamame-boiled-green-soy-beans.jpg?updatedAt=1757606017237"], inStock: true, category: "Legume" },

    { _id: "76", name: "White Radish", price: 25, offerPrice: 20, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_6981293-stock-photo-daikon-radishes.jpg?updatedAt=1757607756450"], inStock: true, category: "Root" },

    { _id: "77", name: "Cherry Tomatoes", price: 60, offerPrice: 55, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_7543091-stock-photo-ripe-fresh-cherry-tomatoes-on.jpg?updatedAt=1757607873469"], inStock: true, category: "Fruiting" },

    { _id: "78", name: "Green Peas", price: 50, offerPrice: 45, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_36557271-stock-photo-green-peas-in-closeup.jpg?updatedAt=1757607935866"], inStock: true, category: "Legume" },

    { _id: "79", name: "Green Chilli", price: 20, offerPrice: 18, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_188219658-stock-photo-green-chilli-pepper.jpg?updatedAt=1757608004627"], inStock: true, category: "Fruiting" },

    { _id: "85", name: "Water Chestnut", price: 60, offerPrice: 55, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_18511837-stock-photo-close-up-pair-of-water.jpg?updatedAt=1757607653341"], inStock: true, category: "Root" },

    { _id: "86", name: "Lotus Root", price: 70, offerPrice: 65, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_86233216-stock-photo-lotus-root-on-white-background.jpg?updatedAt=1757607573802"], inStock: true, category: "Root" },

    { _id: "92", name: "Lentils", price: 65, offerPrice: 60, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_143371301-stock-photo-lentils-isolated-on-white-background.jpg?updatedAt=1757607450012"], inStock: true, category: "Legume" },

    { _id: "93", name: "Soybeans", price: 70, offerPrice: 65, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_376131988-stock-photo-bird-eye-view-soybeans-bowl.jpg?updatedAt=1757607346696"], inStock: true, category: "Legume" },

    { _id: "94", name: "Pinto Beans", price: 75, offerPrice: 70, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_314321822-stock-photo-dry-pinto-beans-in-dark.jpg?updatedAt=1757607194659"], inStock: true, category: "Legume" },

    { _id: "95", name: "Kidney Beans", price: 80, offerPrice: 75, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_4670034-stock-photo-many-cooked-red-beans-yeallow.jpg?updatedAt=1757607105884"], inStock: true, category: "Legume" },

    { _id: "96", name: "Chickpeas", price: 65, offerPrice: 60, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_819452242-stock-photo-pile-kabuli-chickpeas-cut-out.jpg?updatedAt=1757607010968"], inStock: true, category: "Legume" },

    { _id: "97", name: "Lima Beans", price: 70, offerPrice: 65, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_80082786-stock-photo-lima-beans.jpg?updatedAt=1757606918973"], inStock: true, category: "Legume" },

    { _id: "98", name: "Fava Beans", price: 75, offerPrice: 70, image: ["https://ik.imagekit.io/tfhox5xar/depositphotos_23508367-stock-photo-bunch-of-broad-beans.jpg?updatedAt=1757606573876"], inStock: true, category: "Legume" },
];

// 🔹 Highlight search helper
const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

const VegetablesPage: React.FC = () => {
  const [category, setCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("none");

  // 🔹 Filter & Sort Vegetables
  const filteredVegetables = useMemo(() => {
    let filtered = vegetables.filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (category !== "All") {
      filtered = filtered.filter(v => v.category === category);
    }

    if (sortOrder === "asc") {
      return [...filtered].sort((a, b) => a.offerPrice - b.offerPrice);
    } else if (sortOrder === "desc") {
      return [...filtered].sort((a, b) => b.offerPrice - a.offerPrice);
    }
    return filtered;
  }, [searchTerm, category, sortOrder]);

  const categories = ["All", ...Array.from(new Set(vegetables.map(v => v.category))).sort()];

  return (
    <div className="vegetables-page">
      <ToastContainer />

      <h1 className="title">Vegetables</h1>

      {/* Filters */}
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search Vegetables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm("")}>❌</button>
          )}
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="none">Sort by Price</option>
          <option value="asc">Low → High</option>
          <option value="desc">High → Low</option>
        </select>
      </div>

      {/* Vegetables Grid */}
      <div className="vegetables-grid">
        {filteredVegetables.length > 0 ? (
          filteredVegetables.map(v => (
            <ProductCard key={v._id} product={v} />
          ))
        ) : (
          <p className="no-results">❌ No vegetables found</p>
        )}
      </div>
    </div>
  );
};

export default VegetablesPage;
