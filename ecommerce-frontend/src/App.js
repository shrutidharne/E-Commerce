import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    console.log("API URL:", process.env.REACT_APP_API_URL); // Debugging

    axios.get(`${process.env.REACT_APP_API_URL}/products`)
      .then(response => {
        setProducts(response.data.products);
      })
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product._id}>{product.name} - ${product.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;



// import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import CartPage from "./pages/CartPage";

// function App() {
//   const [products, setProducts] = useState([]);
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     console.log("API URL:", process.env.REACT_APP_API_URL); // Debugging

//     axios.get(`${process.env.REACT_APP_API_URL}/products`)
//       .then(response => {
//         setProducts(response.data.products);
//       })
//       .catch(error => console.error("Error fetching products:", error));
//   }, []);

//   const addToCart = (product) => {
//     setCart([...cart, product]);
//   };

//   const removeFromCart = (id) => {
//     setCart(cart.filter(item => item._id !== id));
//   };

//   return (
//     <Router>
//       <Navbar cartCount={cart.length} />
//       <Routes>
//         <Route path="/" element={<Home products={products} addToCart={addToCart} />} />
//         <Route path="/cart" element={<CartPage cartItems={cart} removeFromCart={removeFromCart} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
