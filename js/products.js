// =============================================
//  NEXMART — Products Database
//  All product data lives here
// =============================================

const PRODUCTS = [
  {
    id: 1,
    name: "ProElite Smart Watch",
    category: "Electronics",
    price: 2499,
    oldPrice: 3499,
    rating: 4.5,
    reviews: 1284,
    image: "images/product1.jpg",
    badge: "HOT",
    description: "Track your fitness goals with this premium smartwatch featuring heart-rate monitoring, GPS, sleep tracking, and a stunning AMOLED display. Water-resistant up to 50m with 7-day battery life.",
    features: ["Heart Rate Monitor", "GPS Tracking", "50m Water Resistance", "7-Day Battery", "AMOLED Display"],
    stock: 45,
    isWishlisted: false,
  },
  {
    id: 2,
    name: "SoundWave ANC Headphones",
    category: "Electronics",
    price: 3299,
    oldPrice: 4999,
    rating: 4.8,
    reviews: 892,
    image: "images/3.jpg",
    badge: "SALE",
    description: "Industry-leading active noise cancellation with 30-hour battery life. Crystal-clear call quality and plush ear cushions for all-day comfort.",
    features: ["Active Noise Cancellation", "30-Hour Battery", "Bluetooth 5.2", "Foldable Design", "Built-in Microphone"],
    stock: 23,
    isWishlisted: false,
  },
  {
    id: 3,
    name: "AeroFlex Pro Sneakers",
    category: "Shoes",
    price: 1899,
    oldPrice: 2499,
    rating: 4.3,
    reviews: 567,
    image: "images/2.jpg",
    badge: "NEW",
    description: "Ultra-lightweight running shoes with responsive foam cushioning, breathable mesh upper, and superior grip outsole. Perfect for long runs and everyday wear.",
    features: ["Responsive Foam Sole", "Breathable Mesh Upper", "Anti-Slip Outsole", "Lightweight Design", "Available in 6 Colors"],
    stock: 67,
    isWishlisted: false,
  },
  {
    id: 4,
    name: "UltraBook Pro 15 Laptop",
    category: "Electronics",
    price: 74999,
    oldPrice: 89999,
    rating: 4.7,
    reviews: 341,
    image: "images/4.jpg",
    badge: "SALE",
    description: "Powerful thin & light laptop with the latest processor, 16GB RAM, 512GB SSD, and a stunning 4K OLED display. All-day battery life in a sleek aluminum chassis.",
    features: ["Latest Gen Processor", "16GB DDR5 RAM", "512GB NVMe SSD", "4K OLED Display", "Thunderbolt 4 Ports"],
    stock: 12,
    isWishlisted: false,
  },
  {
    id: 5,
    name: "Artisan Leather Wallet",
    category: "Accessories",
    price: 899,
    oldPrice: 1299,
    rating: 4.4,
    reviews: 723,
    image: "images/5.jpg",
    badge: null,
    description: "Hand-stitched genuine full-grain leather bifold wallet. Features RFID blocking technology, 6 card slots, and ID window. Slim profile that looks great in any pocket.",
    features: ["Full-Grain Leather", "RFID Blocking", "6 Card Slots", "ID Window", "Slim Profile"],
    stock: 89,
    isWishlisted: false,
  },
  {
    id: 6,
    name: "Luxe Gold Sunglasses",
    category: "Accessories",
    price: 1499,
    oldPrice: 1999,
    rating: 4.2,
    reviews: 412,
    image: "images/6.jpg",
    badge: null,
    description: "Fashion-forward polarized sunglasses with UV400 protection. Gold-tone stainless steel frame with premium gradient lenses. Comes in a luxury case.",
    features: ["Polarized Lenses", "UV400 Protection", "Gold Stainless Steel Frame", "Gradient Lenses", "Luxury Case Included"],
    stock: 34,
    isWishlisted: false,
  },
  {
    id: 7,
    name: "AirPods Max Wireless Earbuds",
    category: "Electronics",
    price: 1799,
    oldPrice: 2299,
    rating: 4.6,
    reviews: 1567,
    image: "images/7.jpg",
    badge: "HOT",
    description: "True wireless earbuds with adaptive transparency mode, spatial audio, and sweat resistance. Customizable fit with three silicone tip sizes.",
    features: ["Active Noise Cancellation", "Spatial Audio", "Sweat Resistant", "6-Hour Playback", "24-Hour Total with Case"],
    stock: 78,
    isWishlisted: false,
  },
  {
    id: 8,
    name: "Urban Classic Shirt",
    category: "Fashion",
    price: 799,
    oldPrice: 1199,
    rating: 4.1,
    reviews: 289,
    image: "images/8.jpg",
    badge: null,
    description: "Premium 100% cotton casual shirt with a slim-fit silhouette. Perfect for smart-casual occasions. Machine washable and wrinkle-resistant fabric.",
    features: ["100% Cotton", "Slim Fit", "Wrinkle Resistant", "Machine Washable", "Multiple Colors Available"],
    stock: 156,
    isWishlisted: false,
  },
  {
    id: 9,
    name: "DroneX Vision Pro",
    category: "Electronics",
    price: 34999,
    oldPrice: 44999,
    rating: 4.6,
    reviews: 178,
    image: "images/12.jpg",
    badge: "NEW",
    description: "4K camera drone with 3-axis gimbal stabilization, 30-min flight time, and 10km transmission range. Obstacle avoidance system with intelligent flight modes.",
    features: ["4K/60fps Camera", "3-Axis Gimbal", "30-Min Flight Time", "Obstacle Avoidance", "10km Range"],
    stock: 8,
    isWishlisted: false,
  },
  {
    id: 10,
    name: "StreetEdge Leather Boots",
    category: "Shoes",
    price: 2999,
    oldPrice: 3999,
    rating: 4.5,
    reviews: 334,
    image: "images/9.jpg",
    badge: null,
    description: "Genuine leather ankle boots with cushioned insole and durable rubber outsole. Features side-zip closure and classic lace-up design. Waterproof treatment applied.",
    features: ["Genuine Leather Upper", "Waterproof Treatment", "Side-Zip Closure", "Cushioned Insole", "Rubber Outsole"],
    stock: 28,
    isWishlisted: false,
  },
  {
    id: 11,
    name: "Floral Summer Dress",
    category: "Fashion",
    price: 1299,
    oldPrice: 1799,
    rating: 4.3,
    reviews: 445,
    image: "images/10.jpg",
    badge: "SALE",
    description: "Breezy floral print midi dress in lightweight chiffon fabric. Features adjustable spaghetti straps, smocked bodice, and a flowy skirt. Perfect for summer occasions.",
    features: ["Lightweight Chiffon", "Adjustable Straps", "Smocked Bodice", "Midi Length", "Hand Wash Gentle"],
    stock: 63,
    isWishlisted: false,
  },
  {
    id: 12,
    name: "Sport Performance Backpack",
    category: "Accessories",
    price: 1799,
    oldPrice: 2499,
    rating: 4.4,
    reviews: 521,
    image: "images/11.jpg",
    badge: null,
    description: "Ergonomic 30L backpack with padded laptop compartment, USB charging port, and water bottle pockets. Breathable mesh back panel for all-day comfort.",
    features: ["30L Capacity", "Laptop Compartment (up to 17\")", "USB Charging Port", "Water-Resistant", "Ergonomic Back Panel"],
    stock: 42,
    isWishlisted: false,
  },
];

// Utility: Get discount percentage
function getDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// Utility: Format price in INR
function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

// Utility: Generate star HTML
function generateStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    '<span class="stars">' +
    "★".repeat(full) +
    (half ? '<span class="half-star">★</span>' : "") +
    "☆".repeat(empty) +
    "</span>"
  );
}

// Export for module-less usage
if (typeof window !== "undefined") {
  window.PRODUCTS = PRODUCTS;
  window.getDiscount = getDiscount;
  window.formatPrice = formatPrice;
  window.generateStars = generateStars;
}
