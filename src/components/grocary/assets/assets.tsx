
interface Asset {
  [key: string]: string;
}

interface Category {
  text: string;
  path: string;
  image: string;
  bgColor: string;
}

interface FooterLink {
  text: string;
  url: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  image: string[];
  description: string[];
  createdAt: string;
  updatedAt: string;
  inStock: boolean;
}

interface Address {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: number;
  country: string;
  phone: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  amount: number;
  address: Address;
  status: string;
  paymentType: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

// Directly add your Cloudinary URLs here instead of importing them
export const assets: Asset = {
  logo: "https://ik.imagekit.io/pimx50ija/WhatsApp%20Image%202025-07-29%20at%2011.55.02_14a164c8.jpg?updatedAt=1753770842278",
  search_icon: "https://ik.imagekit.io/pimx50ija/search_icon.svg?updatedAt=1757400609098",
  remove_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/remove_icon.svg",
  arrow_right_icon_colored: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/arrow_right_icon_colored.svg",
  star_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/star_icon.svg",
  star_dull_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/star_dull_icon.svg",
  cart_icon: "https://ik.imagekit.io/pimx50ija/cart_icon.svg?updatedAt=1757437097739",
  nav_cart_icon: "https://ik.imagekit.io/pimx50ija/nav_cart_icon.svg?updatedAt=1757438381624",
  add_icon: "https://ik.imagekit.io/pimx50ija/add_icon.svg?updatedAt=1757438278306",
  refresh_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/refresh_icon.svg",
  product_list_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/product_list_icon.svg",
  order_icon: "https://ik.imagekit.io/pimx50ija/order_icon.svg?updatedAt=1757437515941",
  upload_area: "https://ik.imagekit.io/pimx50ija/upload_area.png?updatedAt=1757438211743",
  profile_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/profile_icon.png",
  menu_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/menu_icon.svg",
  delivery_truck_icon: "https://ik.imagekit.io/pimx50ija/delivery_truck_icon.svg?updatedAt=1757438130048",
  leaf_icon: "https://ik.imagekit.io/pimx50ija/leaf_icon.svg?updatedAt=1757438081780",
  coin_icon: "https://ik.imagekit.io/pimx50ija/coin_icon.svg?updatedAt=1757438019734",
  trust_icon: "https://ik.imagekit.io/pimx50ija/trust_icon.svg?updatedAt=1757437965654",
  black_arrow_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/black_arrow_icon.svg",
  white_arrow_icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/white_arrow_icon.svg",
  main_banner_bg: "https://ik.imagekit.io/pimx50ija/main_banner_bg.png?updatedAt=1757437589516",
  main_banner_bg_sm: "https://ik.imagekit.io/pimx50ija/main_banner_bg.png?updatedAt=1757437589516",
  bottom_banner_image: "https://ik.imagekit.io/pimx50ija/bottom_banner_image.png?updatedAt=1757437687017",
  bottom_banner_image_sm: "https://ik.imagekit.io/pimx50ija/bottom_banner_image_sm.png?updatedAt=1757437747356",
  add_address_iamge: "https://ik.imagekit.io/pimx50ija/add_address_image.svg?updatedAt=1757437813349",
  box_icon: "https://ik.imagekit.io/pimx50ija/box_icon.svg?updatedAt=1757436890101",
};

export const categories: Category[] = [
  {
    text: "Organic veggies",
    path: "Vegetables",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/organic_vegitable_image.png",
    bgColor: "#FEF6DA",
  },
  {
    text: "Fresh Fruits",
    path: "Fruits",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/fresh_fruits_image.png",
    bgColor: "#FEE0E0",
  },
  {
    text: "Cold Drinks",
    path: "Drinks",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/bottles_image.png",
    bgColor: "#F0F5DE",
  },
  {
    text: "Instant Food",
    path: "Instant",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/maggi_image.png",
    bgColor: "#E1F5EC",
  },
  {
    text: "Dairy Products",
    path: "Dairy",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/dairy_product_image.png",
    bgColor: "#FEE6CD",
  },
  {
    text: "Bakery & Breads",
    path: "Bakery",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/bakery_image.png",
    bgColor: "#E0F6FE",
  },
  {
    text: "Grains & Cereals",
    path: "Grains",
    image: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/grain_image.png",
    bgColor: "#F1E3F9",
  },
];

export const footerLinks: FooterSection[] = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "#" },
      { text: "Best Sellers", url: "#" },
      { text: "Offers & Deals", url: "#" },
      { text: "Contact Us", url: "#" },
      { text: "FAQs", url: "#" },
    ],
  },
  {
    title: "Need help?",
    links: [
      { text: "Delivery Information", url: "#" },
      { text: "Return & Refund Policy", url: "#" },
      { text: "Payment Methods", url: "#" },
      { text: "Track your Order", url: "#" },
      { text: "Contact Us", url: "#" },
    ],
  },
  {
    title: "Follow Us",
    links: [
      { text: "Instagram", url: "#" },
      { text: "Twitter", url: "#" },
      { text: "Facebook", url: "#" },
      { text: "YouTube", url: "#" },
    ],
  },
];

export const features: Feature[] = [
  {
    icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/delivery_truck_icon.svg",
    title: "Fastest Delivery",
    description: "Groceries delivered in under 30 minutes.",
  },
  {
    icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/leaf_icon.svg",
    title: "Freshness Guaranteed",
    description: "Fresh produce straight from the source.",
  },
  {
    icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/coin_icon.svg",
    title: "Affordable Prices",
    description: "Quality groceries at unbeatable prices.",
  },
  {
    icon: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/trust_icon.svg",
    title: "Trusted by Thousands",
    description: "Loved by 10,000+ happy customers.",
  },
];

export const dummyProducts: Product[] = [
  // Vegetables
  {
    _id: "gd46g23h",
    name: "Potato 500g",
    category: "Vegetables",
    price: 25,
    offerPrice: 20,
    image: [
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/potato_image_1.png",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/potato_image_2.png",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/potato_image_3.png",
      "https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/potato_image_4.png",
    ],
    description: [
      "Fresh and organic",
      "Rich in carbohydrates",
      "Ideal for curries and fries",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd47g34h",
    name: "Tomato 1 kg",
    category: "Vegetables",
    price: 40,
    offerPrice: 35,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/tomato_image.png"],
    description: [
      "Juicy and ripe",
      "Rich in Vitamin C",
      "Perfect for salads and sauces",
      "Farm fresh quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd48g45h",
    name: "Carrot 500g",
    category: "Vegetables",
    price: 30,
    offerPrice: 28,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/carrot_image.png"],
    description: [
      "Sweet and crunchy",
      "Good for eyesight",
      "Ideal for juices and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd49g56h",
    name: "Spinach 500g",
    category: "Vegetables",
    price: 18,
    offerPrice: 15,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/spinach_image_1.png"],
    description: [
      "Rich in iron",
      "High in vitamins",
      "Perfect for soups and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "gd50g67h",
    name: "Onion 500g",
    category: "Vegetables",
    price: 22,
    offerPrice: 19,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/onion_image_1.png"],
    description: ["Fresh and pungent", "Perfect for cooking", "A kitchen staple"],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Fruits
  {
    _id: "ek51j12k",
    name: "Apple 1 kg",
    category: "Fruits",
    price: 120,
    offerPrice: 110,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/apple_image.png"],
    description: [
      "Crisp and juicy",
      "Rich in fiber",
      "Boosts immunity",
      "Perfect for snacking and desserts",
      "Organic and farm fresh",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek52j23k",
    name: "Orange 1 kg",
    category: "Fruits",
    price: 80,
    offerPrice: 75,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/orange_image.png"],
    description: [
      "Juicy and sweet",
      "Rich in Vitamin C",
      "Perfect for juices and salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek53j34k",
    name: "Banana 1 kg",
    category: "Fruits",
    price: 50,
    offerPrice: 45,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/banana_image_1.png"],
    description: [
      "Sweet and ripe",
      "High in potassium",
      "Great for smoothies and snacking",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek54j45k",
    name: "Mango 1 kg",
    category: "Fruits",

    price: 150,
    offerPrice: 140,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/mango_image_1.png"],
    description: [
      "Sweet and flavorful",
      "Perfect for smoothies and desserts",
      "Rich in Vitamin A",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek55j56k",
    name: "Grapes 500g",
    category: "Fruits",
    price: 70,
    offerPrice: 65,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/grapes_image_1.png"],
    description: [
      "Fresh and juicy",
      "Rich in antioxidants",
      "Perfect for snacking and fruit salads",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Dairy
  {
    _id: "ek56j67k",
    name: "Amul Milk 1L",
    category: "Dairy",
    price: 60,
    offerPrice: 55,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/amul_milk_image.png"],
    description: [
      "Pure and fresh",
      "Rich in calcium",
      "Ideal for tea, coffee, and desserts",
      "Trusted brand quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek57j78k",
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/paneer_image.png"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek58j89k",
    name: "Eggs 12 pcs",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/eggs_image.png"],
    description: [
      "Farm fresh",
      "Rich in protein",
      "Ideal for breakfast and baking",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek59j90k",
    name: "Paneer 200g",
    category: "Dairy",
    price: 90,
    offerPrice: 85,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/paneer_image_2.png"],
    description: [
      "Soft and fresh",
      "Rich in protein",
      "Ideal for curries and snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek60j01k",
    name: "Cheese 200g",
    category: "Dairy",
    price: 140,
    offerPrice: 130,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/cheese_image.png"],
    description: [
      "Creamy and delicious",
      "Perfect for pizzas and sandwiches",
      "Rich in calcium",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Drinks
  {
    _id: "ek61j12k",
    name: "Coca-Cola 1.5L",
    category: "Drinks",
    price: 80,
    offerPrice: 75,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/coca_cola_image.png"],
    description: [
      "Refreshing and fizzy",
      "Perfect for parties and gatherings",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek62j23k",
    name: "Pepsi 1.5L",
    category: "Drinks",
    price: 78,
    offerPrice: 73,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/pepsi_image.png"],
    description: [
      "Chilled and refreshing",
      "Perfect for celebrations",
      "Best served cold",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek63j34k",
    name: "Sprite 1.5L",
    category: "Drinks",
    price: 79,
    offerPrice: 74,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/sprite_image_1.png"],
    description: [
      "Refreshing citrus taste",
      "Perfect for hot days",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek64j45k",
    name: "Fanta 1.5L",
    category: "Drinks",
    price: 77,
    offerPrice: 72,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/fanta_image_1.png"],
    description: [
      "Sweet and fizzy",
      "Great for parties and gatherings",
      "Best served cold",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek65j56k",
    name: "7 Up 1.5L",
    category: "Drinks",
    price: 76,
    offerPrice: 71,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/seven_up_image_1.png"],
    description: [
      "Refreshing lemon-lime flavor",
      "Perfect for refreshing",
      "Best served chilled",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Grains
  {
    _id: "ek66j67k",
    name: "Basmati Rice 5kg",
    category: "Grains",
    price: 550,
    offerPrice: 520,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/basmati_rice_image.png"],
    description: [
      "Long grain and aromatic",
      "Perfect for biryani and pulao",
      "Premium quality",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek67j78k",
    name: "Wheat Flour 5kg",
    category: "Grains",
    price: 250,
    offerPrice: 230,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/wheat_flour_image.png"],
    description: [
      "High-quality whole wheat",
      "Soft and fluffy rotis",
      "Rich in nutrients",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek68j89k",
    name: "Organic Quinoa 500g",
    category: "Grains",
    price: 450,
    offerPrice: 420,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/quinoa_image.png"],
    description: [
      "High in protein and fiber",
      "Gluten-free",
      "Rich in vitamins and minerals",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek69j90k",
    name: "Brown Rice 1kg",
    category: "Grains",
    price: 120,
    offerPrice: 110,
    image: ["https://ik.imagekit.io/pimx50ija/brown_rice_image.png?updatedAt=1757436983763"],
    description: [
      "Whole grain and nutritious",
      "Helps in weight management",
      "Good source of magnesium",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "ek70j01k",
    name: "Barley 1kg",
    category: "Grains",
    price: 150,
    offerPrice: 140,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/barley_image.png"],
    description: [
      "Rich in fiber",
      "Helps improve digestion",
      "Low in fat and cholesterol",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Bakery
  {
    _id: "bk01a24z",
    name: "Brown Bread 400g",
    category: "Bakery",
    price: 40,
    offerPrice: 35,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/brown_bread_image.png"],
    description: [
      "Soft and healthy",
      "Made from whole wheat",
      "Ideal for breakfast and sandwiches",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "bk02b30y",
    name: "Butter Croissant 100g",
    category: "Bakery",
    price: 50,
    offerPrice: 45,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/butter_croissant_image.png"],
    description: [
      "Flaky and buttery",
      "Freshly baked",
      "Perfect for breakfast or snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "bk03c31x",
    name: "Chocolate Cake 500g",
    category: "Bakery",
    price: 350,
    offerPrice: 325,
    image: ["https://ik.imagekit.io/pimx50ija/chocolate_cake_image.png?updatedAt=1757437256043"],
    description: [
      "Rich and moist",
      "Made with premium cocoa",
      "Ideal for celebrations and parties",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "bk04d32w",
    name: "Whole Bread 400g",
    category: "Bakery",
    price: 45,
    offerPrice: 40,
    image: ["https://ik.imagekit.io/pimx50ija/whole_wheat_bread_image.png?updatedAt=1757401267568"],
    description: [
      "Healthy and nutritious",
      "Made with whole wheat flour",
      "Ideal for sandwiches and toast",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "bk05e33v",
    name: "Vanilla Muffins 6 pcs",
    category: "Bakery",
    price: 100,
    offerPrice: 90,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/vanilla_muffins_image.png"],
    description: [
      "Soft and fluffy",
      "Perfect for a quick snack",
      "Made with real vanilla",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },

  // Instant
  {
    _id: "in01f25u",
    name: "Maggi Noodles 280g",
    category: "Instant",

    price: 55,
    offerPrice: 50,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/maggi_image.png"],
    description: [
      "Instant and easy to cook",
      "Delicious taste",
      "Popular among kids and adults",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "in02g26t",
    name: "Top Ramen 270g",
    category: "Instant",
    price: 45,
    offerPrice: 40,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/top_ramen_image.png"],
    description: [
      "Quick and easy to prepare",
      "Spicy and flavorful",
      "Loved by college students and families",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "in03h27s",
    name: "Knorr Cup Soup 70g",
    category: "Instant",
    price: 35,
    offerPrice: 30,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/knorr_soup_image.png"],
    description: [
      "Convenient for on-the-go",
      "Healthy and nutritious",
      "Variety of flavors",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "in04i28r",
    name: "Yippee Noodles 260g",
    category: "Instant",
    price: 50,
    offerPrice: 45,
    image: ["https://ik.imagekit.io/pimx50ija/yippee_image.png?updatedAt=1757401073157"],
    description: [
      "Non-fried noodles for healthier choice",
      "Tasty and filling",
      "Convenient for busy schedules",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
  {
    _id: "in05j29q",
    name: "Oats Noodles 72g",
    category: "Instant",
    price: 40,
    offerPrice: 35,
    image: ["https://res.cloudinary.com/your-cloud-name/image/upload/v1/assets/maggi_oats_image.png"],
    description: [
      "Healthy alternative with oats",
      "Good for digestion",
      "Perfect for breakfast or snacks",
    ],
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
    inStock: true,
  },
];

export const dummyAddress: Address[] = [
  {
    _id: "67b5b9e54ea97f71bbc196a0",
    userId: "67b5880e4d09769c5ca61644",
    firstName: "Great",
    lastName: "Stack",
    email: "user.greatstack@gmail.com",
    street: "Street 123",
    city: "Main City",
    state: "New State",
    zipcode: 123456,
    country: "IN",
    phone: "1234567890",
  },
];

export const dummyOrders: Order[] = [
  {
    _id: "67e2589a8f87e63366786400",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[3],
        quantity: 2,
        _id: "67e2589a8f87e63366786401",
      },
    ],
    amount: 89,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "Online",
    isPaid: true,
    createdAt: "2025-03-25T07:17:46.018Z",
    updatedAt: "2025-03-25T07:18:13.103Z",
  },
  {
    _id: "67e258798f87e633667863f2",
    userId: "67b5880e4d09769c5ca61644",
    items: [
      {
        product: dummyProducts[0],
        quantity: 1,
        _id: "67e258798f87e633667863f3",
      },
      {
        product: dummyProducts[1],
        quantity: 1,
        _id: "67e258798f87e633667863f4",
      },
    ],
    amount: 43,
    address: dummyAddress[0],
    status: "Order Placed",
    paymentType: "COD",
    isPaid: false,
    createdAt: "2025-03-25T07:17:13.068Z",
    updatedAt: "2025-03-25T07:17:13.068Z",
  },
];