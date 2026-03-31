import React, { useState, useEffect } from 'react';
import './App.css';

// Product data and structure as described in the original file
const Products = [
  { id: 0, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "shirt", price: 50, image: "/images/product1.jpg", quantity: 1 },
  { id: 1, name: "Lucky Brand Men's Venice Burnout Notch Neck Pant", category: "Pant", price: 40, image: "/images/product2.jpg", quantity: 1 },
  { id: 2, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "Pant", price: 39, image: "/images/product3.jpg", quantity: 1 },
  { id: 3, name: "Under Armour Men's New Freedom Flag T-Shirt", category: "shirt", price: 57, image: "/images/product4.jpg", quantity: 1 },
  { id: 4, name: "Brit mens check placket polo", category: "shirt", price: 60, image: "/images/black shirt.jpg", quantity: 1 },
  { id: 5, name: "Brit mens check placket polo", category: "shirt", price: 70, image: "/images/black shirt.jpg", quantity: 1 }
];

function App() {
  const [cartItem, setCartItem] = useState([]);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("exampleItemData");
    if (savedCart) {
      setCartItem(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("exampleItemData", JSON.stringify(cartItem));
  }, [cartItem]);

  const removeFromCart = (itemId) => {
    setCartItem(prevCartItems => prevCartItems.filter(item => item.id !== itemId));
  };

  // Adds items to cart, updating quantity if item exists
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
  };

  const [filteredItems, setFilteredItems] = useState(Products);
  const ButtonItems = [...new Set(Products.map((item) => item.category))];

  const filterItems = (cat) => {
    const newItems = Products.filter((newVal) => newVal.category === cat);
    setFilteredItems(newItems);
  };

  return (
    <div className="App">
      <Header />
      <Category
        filterItems={filterItems}
        setFilteredItems={setFilteredItems}
        ButtonItems={ButtonItems}
      />
      <ProductList clothes={filteredItems} shoppingCart={shoppingCart} />
      <AddToCart cartItem={cartItem} removeFromCart={removeFromCart} />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <div className="navbar">
        <h1>Amazon</h1>
        <input type="text" placeholder="search product" />
        <a href="#">Accounts and lists</a>
        <a href="#">return and orders</a>
        <a href="#">Cart</a>
      </div>
    </div>
  );
}

// Lists products and manages individual item quantity before adding to cart
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
              <button onClick={() => shoppingCart(cloth)}>AddToCart</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Displays cart items in a table with a total price calculation
const AddToCart = ({ cartItem, removeFromCart }) => {
  const cartTotal = cartItem.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="AddToCart">
      <h1>ShoppingCart</h1>
      {cartItem.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cartItem.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td>
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "auto" }} />
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

// Handles category and price filtering
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

