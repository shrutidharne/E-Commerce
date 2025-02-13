const products = [
  {
    name: "Men's T-Shirt",
    price: 999,
    description: "Comfortable cotton t-shirt for men.",
    category: "Clothing",
    stock: 50,
    imageUrl: "https://via.placeholder.com/150",
  },
  {
    name: "Women's Jeans",
    price: 1999,
    description: "High-quality denim jeans for women.",
    category: "Clothing",
    stock: 30,
    imageUrl: "https://via.placeholder.com/150",
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "admin1234", // You should hash passwords before inserting them
    role: "admin",
    avatar: {
      public_id: "admin_avatar",
      url: "https://via.placeholder.com/150", // Dummy image URL
    },
  },
  {
    name: "Test User",
    email: "test@example.com",
    password: "test1234",
    role: "user",
    avatar: {
      public_id: "test_avatar",
      url: "https://via.placeholder.com/150", // Dummy image URL
    },
  },
];

module.exports = { products, users };
