import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

const Products = [
  { id: 0, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "shirt", price: 50, image: "/images/product1.jpg", quantity: 1 },
  { id: 1, name: "Lucky Brand Men's Venice Burnout Notch Neck Pant", category: "Pant", price: 40, image: "/images/product2.jpg", quantity: 1 },
  { id: 2, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "shirt", price: 39, image: "/images/product3.jpg", quantity: 1 },
  { id: 3, name: "Under Armour Men's New Freedom Flag T-Shirt", category: "shirt", price: 57, image: "/images/product4.jpg", quantity: 1 },
  { id: 4, name: "Brit mens check placket polo", category: "shirt", price: 60, image: "/images/black shirt.jpg", quantity: 1 },
  { id: 5, name: "Brit mens check placket polo", category: "shirt", price: 70, image: "/images/black shirt.jpg", quantity: 1 }
];

function App() {
  const [cartItem, setCartItem] = useState([]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("exampleItemData");
    if (savedCart) {
      setCartItem(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("exampleItemData", JSON.stringify(cartItem));
  }, [cartItem]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const removeFromCart = (itemId) => {
    setCartItem(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
  };

  const shoppingCart = (item) => {
    setCartItem(prevCartItems => {
      const itemExists = prevCartItems.find(cartItem => cartItem.id === item.id);

      if (itemExists) {
        return prevCartItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCartItems, item];
    });
    setToast(`Added "${item.name}" to cart`);
  };

  const cartCount = cartItem.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Router>
      <div className="App">
        <Header cartCount={cartCount} />
        <Routes>
          <Route path="/" element={<ShopPage shoppingCart={shoppingCart} />} />
          <Route
            path="/cart"
            element={<AddToCart cartItem={cartItem} removeFromCart={removeFromCart} />}
          />
        </Routes>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </Router>
  );
}

function ShopPage({ shoppingCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(Products);
  const ButtonItems = [...new Set(Products.map((item) => item.category))];

  const filterItems = (cat) => {
    const newItems = Products.filter((newVal) => newVal.category === cat);
    setFilteredItems(newItems);
  };

  const visibleItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="search-bar-wrap">
        <input
          type="text"
          placeholder="Search product"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Category
        filterItems={filterItems}
        setFilteredItems={setFilteredItems}
        ButtonItems={ButtonItems}
      />
      <ProductList clothes={visibleItems} shoppingCart={shoppingCart} />
    </>
  );
}

function Header({ cartCount }) {
  return (
    <div className="header">
      <div className="navbar">
        <Link to="/" className="brand-link">
           <h1>Fernwood</h1>
        </Link>
        <a href="#">Accounts and lists</a>
        <a href="#">Returns and orders</a>
        <Link to="/cart">Cart ({cartCount})</Link>
      </div>
    </div>
  );
}

function ProductList({ clothes, shoppingCart }) {
  const [clothesState, setClothesState] = useState(clothes);

  useEffect(() => {
    setClothesState(clothes);
  }, [clothes]);

  const AddItem = (cloth_id) => {
    setClothesState((prevClothes) =>
      prevClothes.map((cloth) =>
        cloth.id === cloth_id ? { ...cloth, quantity: cloth.quantity + 1 } : cloth
      )
    );
  };

  const removeItem = (cloth_id) => {
    setClothesState((prevClothes) =>
      prevClothes.map((cloth) =>
        cloth.id === cloth_id && cloth.quantity > 1 ? { ...cloth, quantity: cloth.quantity - 1 } : cloth
      )
    );
  };

  if (clothesState.length === 0) {
    return (
      <div className="container">
        <p className="no-results">No products match your search.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cards">
        {clothesState.map(function (cloth) {
          return (
            <div key={cloth.id} className="item">
              <img src={cloth.image} alt={cloth.name} />
              <h3>{cloth.name}</h3>
              <h2>${cloth.price}</h2>
              <p>
                Quantity of Item:{" "}
                <button onClick={() => AddItem(cloth.id)}>+</button>
                {cloth.quantity}
                <button onClick={() => removeItem(cloth.id)}>-</button>
              </p>
              <button onClick={() => shoppingCart(cloth)}>Add to cart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const AddToCart = ({ cartItem, removeFromCart }) => {
  const cartTotal = cartItem.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="AddToCart">
      <h1>Shopping Cart</h1>
      {cartItem.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Continue shopping →</Link>
        </p>
      ) : (
        <>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItem.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "auto", borderRadius: "4px" }} />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", fontSize: "1.2rem", fontWeight: "bold" }}>
            Total Price: ${cartTotal}
          </div>
        </>
      )}
    </div>
  );
};

function Category({ filterItems, setFilteredItems, ButtonItems }) {
  const [priceRange, setPriceRange] = useState(1000);

  const HandlePrice = (e) => {
    setPriceRange(e.target.value);
  };

  return (
    <div className="filteration">
      <div className="inner-filteration">
        <div className="By-Category">
          <h2>By Category</h2>
          <button onClick={() => setFilteredItems(Products)}>All</button>
          {ButtonItems.map((item) => (
            <button key={item} onClick={() => filterItems(item)}>
              {item}
            </button>
          ))}
        </div>
        <div className="By-Price">
          <h2>By Price (Under ${priceRange})</h2>
          <input
            type="range"
            min={0}
            max={1000}
            value={priceRange}
            onChange={HandlePrice}
          />
        </div>
      </div>
    </div>
  );
}
export default App;
