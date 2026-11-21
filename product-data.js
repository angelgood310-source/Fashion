// products-data.js - 50 Fashion & Premium Products Data
const categoryImages = {
  "Dresses": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500",
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500"
  ],
  "Mobiles": [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
    "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500",
    "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500",
    "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500"
  ],
  "Slippers": [
      
    "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500",
    "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=500",
    "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500"
  ],
  "Watches": [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"
  ],
  "Bags": [
    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
  ]
};

const categoriesList = ["Dresses", "Mobiles", "Slippers", "Watches", "Bags"];

const allProducts = Array.from({ length: 50 }, (_, i) => {
  const cat = categoriesList[i % categoriesList.length];
  const imgs = categoryImages[cat];
  const price = (i + 1) * 350 + 499;
  return {
    id: i + 1,
    title: `${cat} Premium Edition #${i + 1}`,
    category: cat,
    price: price,
    oldPrice: price + 1200,
    image: imgs[i % imgs.length],
    description: `Premium quality ${cat.toLowerCase()} designed for daily comfort and modern style.`
  };
});