import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Footer from './footer';

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
        <Footer />
      </div>
    </Router>
  );
}

function ShopPage({ shoppingCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);


  useEffect(() => {
    setLoading(true);
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
       
        const formatted = data.map((item) => ({
          id: item.id,
          name: item.title,
          category: item.category,
          price: item.price,
          image: item.image,
          quantity: 1,
        }));
        setProducts(formatted);
        setFilteredItems(formatted);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); 

  const ButtonItems = [...new Set(products.map((item) => item.category))];

  const filterItems = (cat) => {
    const newItems = products.filter((newVal) => newVal.category === cat);
    setFilteredItems(newItems);
  };

  const visibleItems = filteredItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="no-results">Loading products…</p>;
  }

  if (error) {
    return (
      <div className="container">
        <p className="no-results">Couldn't load products: {error}</p>
      </div>
    );
  }

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
        allProducts={products}
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
                  <td data-label="Image">
                    <img src={item.image} alt={item.name} style={{ width: "50px", height: "auto", borderRadius: "4px" }} />
                  </td>
                  <td data-label="Name">{item.name}</td>
                  <td data-label="Price">${item.price}</td>
                  <td data-label="Quantity">{item.quantity}</td>
                  <td data-label="Remove">
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

function Category({ filterItems, setFilteredItems, ButtonItems, allProducts }) {
  const [priceRange, setPriceRange] = useState(1000);

  const HandlePrice = (e) => {
    setPriceRange(e.target.value);
  };

  return (
    <div className="filteration">
      <div className="inner-filteration">
        <div className="By-Category">
          <h2>By Category</h2>
          <button onClick={() => setFilteredItems(allProducts)}>All</button>
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
