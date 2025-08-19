import type { ReactElement } from 'react';
import {
  MdAgriculture, MdEvent, MdFastfood, MdOutlineElectricalServices,
  MdOutlineKitchen, MdOutlineMiscellaneousServices, MdOutlinePlumbing,
  MdSchool
} from 'react-icons/md';
import { GiCarrot, GiAutoRepair, GiSofa } from 'react-icons/gi';
import { FaSpa, FaTractor } from 'react-icons/fa';
import { RiComputerLine } from 'react-icons/ri';
import { BsFillHouseDoorFill } from 'react-icons/bs';

export interface ServiceCategory {
  category: string;
  icon: ReactElement;
  services: string[];
}

export const serviceCategories: ServiceCategory[] = [
  { category: 'Agriculture Services', icon: <MdAgriculture size={28} />, services: ['Tractor Repair', 'Crop Advisor', 'Seed & Fertilizer Supplier', 'Borewell Drilling', 'Pest Control'] },
  { category: 'Livestock & Veterinary', icon: <GiCarrot size={28} />, services: ['Veterinary Doctor', 'Cattle Feed Supplier', 'Poultry Farm Support'] },
  { category: 'Local & Daily Needs', icon: <MdFastfood size={28} />, services: ['Tiffin Service', 'Local Transport', 'Milk Delivery', 'Drinking Water Supply'] },
  { category: 'Rural Technicians', icon: <FaTractor size={28} />, services: ['Water Pump Repair', 'Solar Panel Installation', 'Mobile Phone Repair'] },
  { category: 'Home Services', icon: <MdOutlineMiscellaneousServices size={28} />, services: ['Electrician', 'Carpenter', 'Painter', 'House Cleaning', 'Gardener'] },
  { category: 'Appliance Repair', icon: <MdOutlineKitchen size={28} />, services: ['AC Repair', 'Refrigerator Repair', 'Washing Machine Repair', 'TV Repair', 'Geyser Repair'] },
  { category: 'Renovation & Construction', icon: <BsFillHouseDoorFill size={28} />, services: ['Home Renovation', 'Interior Designer', 'Construction Contractor', 'Architect'] },
  { category: 'Plumbing', icon: <MdOutlinePlumbing size={28} />, services: ['Plumber', 'Leak Repair', 'Pipe Installation', 'Water Tank Cleaning'] },
  { category: 'Health & Wellness', icon: <FaSpa size={28} />, services: ['Yoga Instructor', 'Fitness Trainer', 'Dietitian', 'Salon at Home', 'Massage Therapist'] },
  { category: 'Education', icon: <MdSchool size={28} />, services: ['Home Tutor', 'Maths Tutor', 'Science Tutor', 'Music Teacher', 'Spoken English'] },
  { category: 'IT & Digital', icon: <RiComputerLine size={28} />, services: ['Web Developer', 'App Developer', 'Digital Marketing', 'Graphic Designer', 'Content Writer'] },
  { category: 'Events & Photography', icon: <MdEvent size={28} />, services: ['Photographer', 'Videographer', 'Event Planner', 'Catering Services', 'Makeup Artist'] },
  { category: 'Vehicle Services', icon: <GiAutoRepair size={28} />, services: ['Car Mechanic', 'Bike Mechanic', 'Car Wash', 'Driving School'] },
];

export const getAllServiceNames = () => {
  const allServices: { name: string, category: string }[] = [];
  serviceCategories.forEach(category => {
    category.services.forEach(serviceName => {
      allServices.push({ name: serviceName, category: category.category });
    });
  });
  return allServices;
};

export const getIconForCategory = (categoryName: string): ReactElement => {
    const category = serviceCategories.find(c => c.category === categoryName);
    return category ? category.icon : <MdOutlineMiscellaneousServices size={28} />;
};
