import React, { useState } from "react";
//import "./GrainsPage.css";

const GRAINS = [
  { id: 1, name: "Rice", price: "₹60/kg", inStock: true, image: "https://ik.imagekit.io/pimx50ija/rice.png" },
  { id: 2, name: "Wheat", price: "₹50/kg", inStock: true, image: "https://ik.imagekit.io/pimx50ija/wheat.png" },
  { id: 3, name: "Oats", price: "₹80/kg", inStock: false, image: "https://ik.imagekit.io/pimx50ija/oats.png" },
];

const GrainsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const filteredGrains = GRAINS.filter(grain => grain.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="top-offers-banner mb-6 p-4 rounded-lg bg-orange-100 text-center font-semibold">
        🌾 Grains & Cereals Top Offers!
      </div>

      <div className="search-bar mb-6">
        <input
          type="text"
          placeholder="Search Grains..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {filteredGrains.length === 0 ? (
        <p className="text-gray-500">No grains found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredGrains.map(grain => (
            <div key={grain.id} className="border rounded-lg shadow p-3 hover:shadow-lg cursor-pointer bg-white flex flex-col">
              <img src={grain.image || "https://via.placeholder.com/200"} alt={grain.name} className="w-full h-40 object-cover rounded" />
              <div className="mt-2 flex-1 flex flex-col justify-between">
                <h2 className="font-semibold text-lg">{grain.name}</h2>
                <p className="text-gray-600 text-sm">{grain.price}</p>
                <p className={`text-sm mt-1 ${grain.inStock ? "text-green-600" : "text-red-500"}`}>
                  {grain.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrainsPage;
