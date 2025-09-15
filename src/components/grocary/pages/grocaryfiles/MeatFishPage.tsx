import React from "react";

// --- Meat & Fish Data (simplified) ---
const MEAT_FISH_LIST = {
  "Chicken (చికెన్)": [
    { id: "c1", name: "Skinless Curry Cut", teluguName: "కట్ చికెన్" },
    { id: "c2", name: "Boneless Cubes", teluguName: "బోన్‌లెస్" },
    { id: "c3", name: "Biryani Cut", teluguName: "బిర్యానీ కట్" },
  ],
  "Country Chicken (నాటుకోడి)": [
    { id: "nc1", name: "Naatukodi Curry Cut", teluguName: "నాటుకోడి కూర" },
  ],
  "Goat & Lamb (మేక & గొర్రె)": [
    { id: "m1", name: "Goat Curry Cut", teluguName: "మేక మాంసం" },
    { id: "m2", name: "Lamb Chops", teluguName: "గొర్రె చాప్స్" },
    { id: "m3", name: "Mutton Keema", teluguName: "మటన్ ఖీమా" },
  ],
};

// --- MeatFishListPage Component ---
const MeatFishListPage: React.FC = () => {
  const categories = Object.keys(MEAT_FISH_LIST);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Meat & Fish List 🍗🐐</h1>
      
      {categories.map((category) => (
        <div key={category} style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#333" }}>{category}</h2>
          <ul>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MeatFishListPage;
