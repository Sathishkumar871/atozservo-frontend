import React, { useState } from "react";
//import "./SnacksPage.css";

// Sample snacks data
const SNACKS = [
  { id: 1, name: "Potato Chips", price: "₹20/pack", inStock: true, image: "https://ik.imagekit.io/pimx50ija/potato_chips.png" },
  { id: 2, name: "Nachos", price: "₹30/pack", inStock: true, image: "https://ik.imagekit.io/pimx50ija/nachos.png" },
  { id: 3, name: "Popcorn", price: "₹25/pack", inStock: false, image: "https://ik.imagekit.io/pimx50ija/popcorn.png" },
  // Add more snacks as needed
];

const SnacksPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredSnacks = SNACKS.filter(snack =>
    snack.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top Offers Banner */}
      <div className="top-offers-banner mb-6 p-4 rounded-lg bg-pink-100 text-center font-semibold">
        🍿 Snacks Top Offers!
      </div>

      {/* Search Bar */}
      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="Search Snacks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>

      {/* Snacks Grid */}
      {filteredSnacks.length === 0 ? (
        <p className="text-gray-500">No snacks found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredSnacks.map(snack => (
            <div
              key={snack.id}
              className="border rounded-lg shadow p-3 hover:shadow-lg cursor-pointer bg-white flex flex-col"
            >
              <img
                src={snack.image || "https://via.placeholder.com/200"}
                alt={snack.name}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold text-lg">{snack.name}</h2>
                <p className="text-gray-600 text-sm">{snack.price}</p>
                <p className={`text-sm mt-1 ${snack.inStock ? "text-green-600" : "text-red-500"}`}>
                  {snack.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SnacksPage;
