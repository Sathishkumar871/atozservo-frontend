/*import React from "react";
import "./AlcoholPage.css";

// మీరు అందించిన ఆల్కహాల్ డేటా
const ALCOHOL_DATA = {
  Whiskey: [
    { id: 1, name: "Blenders Pride", price: 1200, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/wp8916783.png", offerPrice: 1100, _id: "1" },
    { id: 2, name: "Royal Challenge", price: 1800, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_231534.jpg", offerPrice: 1750, _id: "2" },
    { id: 3, name: "Signature", price: 1500, inStock: false, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_234132.jpg", offerPrice: 1400, _id: "3" },
    { id: 4, name: "Royal Stag", price: 1500, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_231534.jpg", offerPrice: 1450, _id: "4" },
    { id: 5, name: "McDowell's No.1", price: 2110, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/bfd675d455d0377967ed8f7bae33b9f3.jpg", offerPrice: 2000, _id: "5" },
  ],
  Beer: [
    { id: 6, name: "Kingfisher Beer", price: 150, inStock: false, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233959.jpg", offerPrice: 140, _id: "6" },
    { id: 7, name: "Budweiser", price: 150, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_234044.jpg", offerPrice: 140, _id: "7" },
    { id: 8, name: "Tuborg", price: 150, inStock: false, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233941.jpg", offerPrice: 140, _id: "8" },
    { id: 9, name: "Heineken", price: 150, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233855.jpg", offerPrice: 140, _id: "9" },
  ],
  Rum: [
    { id: 10, name: "Old Monk Rum", price: 1500, inStock: false, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233703.jpg", offerPrice: 1400, _id: "10" },
    { id: 11, name: "Bacardi Rum", price: 1100, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/bacardi.png", offerPrice: 1050, _id: "11" },
  ],
  Brandy: [
    { id: 12, name: "Mansion House Brandy", price: 1500, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233627.jpg", offerPrice: 1400, _id: "12" },
  ],
  Vodka: [
    { id: 13, name: "Smirnoff Vodka", price: 1500, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233604.jpg", offerPrice: 1400, _id: "13" },
    { id: 14, name: "Magic Moments Vodka", price: 1310, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/IMG_20250911_233539.jpg", offerPrice: 1250, _id: "14" },
  ],
  Wine: [
    { id: 15, name: "Sula Wine", price: 850, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/sula.png", offerPrice: 800, _id: "15" },
  ],
  Gin: [
    { id: 16, name: "Bombay Sapphire", price: 2500, inStock: true, image: "https://ik.imagekit.io/tfhox5xar/bombay.png", offerPrice: 2400, _id: "16" },
  ],
};

// అన్ని ఉత్పత్తులను ఒకే లిస్ట్‌గా మార్చే ఫంక్షన్
const getAllAlcohols = () => Object.values(ALCOHOL_DATA).flat();

// ఒకే ఉత్పత్తిని ప్రదర్శించే సింపుల్ కాంపోనెంట్
const ProductDisplay = ({ alcohol }) => (
  <div className="product-card">
    <div className="product-image-container">
      <img src={alcohol.image} alt={alcohol.name} className="product-image" />
    </div>
    <div className="product-card-details">
      <h3 className="product-name">{alcohol.name}</h3>
      <p className="product-price">
        ₹{alcohol.offerPrice}{" "}
        <span className="old-price">₹{alcohol.price}</span>
      </p>
    </div>
  </div>
);

// ప్రధాన పేజీ కాంపోనెంట్
const AlcoholPage: React.FC = () => {
  const allAlcohols = getAllAlcohols();

  return (
    <div className="alcohol-page">
      <main className="product-content">
        <div className="product-grid">
          {allAlcohols.map((alcohol) => (
            <ProductDisplay key={alcohol._id} alcohol={alcohol} />
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 The Liquor Store. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AlcoholPage;*/