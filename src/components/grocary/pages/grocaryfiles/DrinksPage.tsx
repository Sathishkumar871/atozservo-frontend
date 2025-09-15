import React, { useState } from "react";
//import "./DrinksPage.css";

// Sample drinks data
const DRINKS = [
  {
    id: 1,
    name: "Coca Cola",
    price: "₹50/bottle",
    inStock: true,
    image: "https://ik.imagekit.io/pimx50ija/coca_cola.png",
  },
  {
    id: 2,
    name: "Pepsi",
    price: "₹45/bottle",
    inStock: true,
    image: "https://ik.imagekit.io/pimx50ija/pepsi.png",
  },
  {
    id: 3,
    name: "Orange Juice",
    price: "₹80/bottle",
    inStock: false,
    image: "https://ik.imagekit.io/pimx50ija/orange_juice.png",
  },
  // Add more drinks as needed
];

const DrinksPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredDrinks = DRINKS.filter((drink) =>
    drink.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Offers Banner */}
      <div className="top-offers-banner mb-6 p-4 rounded-lg bg-blue-100 text-center font-semibold">
        🥤 Cold Drinks Top Offers!
      </div>

      {/* Search Bar */}
      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="Search Drinks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Drinks Grid */}
      {filteredDrinks.length === 0 ? (
        <p className="text-gray-500">No drinks found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredDrinks.map((drink) => (
            <div
              key={drink.id}
              className="border rounded-lg shadow p-3 hover:shadow-lg cursor-pointer bg-white flex flex-col"
            >
              <img
                src={drink.image || "https://via.placeholder.com/200"}
                alt={drink.name}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold text-lg">{drink.name}</h2>
                <p className="text-gray-600 text-sm">{drink.price}</p>
                <p
                  className={`text-sm mt-1 ${
                    drink.inStock ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {drink.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrinksPage;
