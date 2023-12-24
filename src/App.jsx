import { useState } from 'react'
import React, { useEffect } from 'react';
import './App.css'

const Products = [
  { id: 1, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "shirt", price: 50, image: "/images/71fP0SzFf+L._AC_UL480_QL65_.jpg", quantity: 1 },
  { id: 2, name: "Lucky Brand Men's Venice Burnout Notch Neck Pant", category: "Pant", price: 40, image: "/images/71iArzbJesL._AC_UL480_QL65_.jpg", quantity: 1},
  { id: 3, name: "Gildan Adult Heavy Cotton Long Sleeve T-Shirt", category: "Pant", price: 39, image: "/images/71waKwfaLCL._AC_UL480_QL65_.jpg", quantity: 1 },
  { id: 4, name: "Under Armour Men's New Freedom Flag T-Shirt", category: "shirt", price: 57, image: "/images/81Y-XWbN7PL._AC_UL480_QL65_.jpg", quantity: 1 },
  { id: 5, name: "Brit mens check placket polo", category: "shirt", price: 60, image: "/images/black shirt.jpg", quantity: 1 },
  { id: 6, name: "Brit mens check placket polo", category: "shirt", price: 70, image: "/images/black shirt.jpg", quantity: 1 }
]


function App() {
  const [cartItem, setCartItem] = useState([])
  const shoppingCart = (item) => {
    setCartItem([...cartItem, item])
  }
  const [filteredItems, setFilteredItems] = useState(Products)
  const ButtonItems = [... new Set(Products.map((item) => item.category))]

  const filterItems = (cat, pri) => {
    const newItems = Products.filter((newVal) => (newVal.category === cat))
    const filterPrice = Products.filter((newPrice) => (newPrice.price >= 50))
    setFilteredItems(newItems)
  }
  return(
  <div class="App">
    <Header />
    <Category
      filterItems={filterItems}
      setFilteredItems={setFilteredItems}
      ButtonItems={ButtonItems}
    />
    <ProductList clothes={filteredItems} shoppingCart={shoppingCart} />
    <AddToCart cartItem={cartItem} />
    </div>
  )
}
function Header() {

  return (
    <>
      <div class="header">
        <div class="navbar">
          <h1>Amazon</h1>
          <input type="text" placeholder='search product' />
          <a href="#">Accounts and lists</a>
          <a href="#">return and orders</a>
          <a href="#">Cart</a>
        </div>
      </div >
    </>
  )
}
function ProductList({ clothes, shoppingCart }) {
  
  const [clothesState, setClothesState] = useState(clothes)

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
        cloth.id === cloth_id && cloth.quantity > 1 ? {
          ...cloth, quantity: cloth.quantity - 1
        } : cloth
        
      )
    )
  }
  return (
    <>
      <div class='container'>
        <div class='cards'>
          {
            clothesState.map(function (cloth) {
              return (
                <>
                  <div class="item">
                    <img src={cloth.image} alt="" />
                    <h3>{cloth.name}</h3>
                    <h2>{cloth.price}</h2>
                    <p>Quantity of Item: <button onClick={() => AddItem(cloth.id)}>+</button>{cloth.quantity}<button onClick={() => removeItem(cloth.id)}>-</button></p>
                    <button onClick={()=> shoppingCart(cloth)}>AddToCart</button>
                  </div>
                </>
              )
            }) 
          }
        </div>
      </div>
    </>
  )
}
const AddToCart =({cartItem }) => {
  return (
    <>
      <div class="AddToCart">
        <h1>ShoppingCart</h1>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>price</th>
            <th>Quantity</th>
          </tr>

          {cartItem.map((item) => (
            <>

              <tr>
                <img src={item.image} />
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
              </tr>
            </>
          ))
          }
      </div>
    </>
  )
}
function Category({ filterItems, setFilteredItems, ButtonItems }) {
  const [priceRange, setPriceRange] = useState()
  const HandlePrice = (value) => {
    setPriceRange(value);
  }
  return (
    <>
      <div className='filteration'>
        <div className='inner-filteration'>
          <div class="By-Category">
            <h2>By Category</h2>
            <button onClick={() => setFilteredItems(Products)}>All</button>
            {
              ButtonItems.map((item) => (
                <button key={item} onClick={() => {(filterItems(item)) }}>
                  {item}
                </button>
              ))
            }
          </div>
          <div class="By-Price">
            <h2>By Price</h2>
            <input type="range" 
              min={0}
              max={1000}
              value={priceRange}
              onchange={HandlePrice}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default App;
