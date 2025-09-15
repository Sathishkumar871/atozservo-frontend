import React, { useEffect, useState} from 'react';
import type { ReactElement } from 'react';

import axios from 'axios';
import './Category.css';

import {
  MdOutlineKitchen, MdOutlineElectricalServices, MdFitnessCenter,
  MdOutlineMiscellaneousServices, MdOutlineMedicalServices,
  MdEvent, MdOutlinePlumbing, MdSecurity, MdSchool, MdEngineering
} from 'react-icons/md';
import { GiSofa,  GiAutoRepair } from 'react-icons/gi';
import { FaSpa, FaUserTie, FaRegBuilding } from 'react-icons/fa';
import { RiToolsLine } from 'react-icons/ri';
import { BsFillHouseDoorFill } from 'react-icons/bs';
import { AiOutlineCamera, AiOutlineLaptop } from 'react-icons/ai';

interface Service {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

const iconMap: Record<string, ReactElement> = {
  'Appliances': <MdOutlineKitchen size={28} />,
  'Furniture': <GiSofa size={28} />,
  'Electrical service': <MdOutlineElectricalServices size={28} />,
  'Fitness': <MdFitnessCenter size={28} />,
  'Beauty & Grooming': <FaSpa size={28} />,
  'Gadget Repair': <AiOutlineLaptop size={28} />,
  'Vehicle Services': <GiAutoRepair size={28} />,
  'Interior & Furniture': <GiSofa size={28} />,
  'Marriage Match': <FaUserTie size={28} />,
  'Event Services': <MdEvent size={28} />,
  'Medical Services': <MdOutlineMedicalServices size={28} />,
  'Document Services': <BsFillHouseDoorFill size={28} />,
  'Job Support': <FaRegBuilding size={28} />,
  'Education': <MdSchool size={28} />, // ✅ Corrected Education icon
  'Security Services': <MdSecurity size={28} />, // ✅ Corrected Security Services icon
  'Photography': <AiOutlineCamera size={28} />,
  'Home Services': <MdOutlineMiscellaneousServices size={28} />,
  'Plumbing': <MdOutlinePlumbing size={28} />,
  'Tools': <RiToolsLine size={28} />, // ✅ Added Tools icon
  'Engineering': <MdEngineering size={28} />, // ✅ Added Engineering icon
};

const Category: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/services`).then((res) => {
      const services: Service[] = Array.isArray(res.data) ? res.data : [];
      setAllServices(services);
      const cats = Array.from(new Set(services.map((s) => s.category)));
      setCategories(cats);
    });
  }, []);

  const filteredServices: Service[] = selectedCategory
    ? allServices.filter((s) => s.category === selectedCategory)
    : [];

  return (
    <div className="category-layout">
      <div className="sidebar-scroll">
        <div className="category-scroll">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`category-icon-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              <div className="icon-circle">
                {iconMap[cat] || <MdOutlineMiscellaneousServices size={28} />}
              </div>
              <span className="icon-label">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="services-area">
        {selectedCategory ? (
          <>
            <h3>{selectedCategory} Services</h3>
            <div className="services-grid">
              {filteredServices.map((s) => (
                <div key={s._id} className="service-card">
                  <img src={s.image} alt={s.name} />
                  <h4>{s.name}</h4>
                  <p>{s.description}</p>
                  <button className="book-btn">Book Now</button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Select a category to see services.</p>
        )}
      </div>
    </div>
  );
};

export default Category;