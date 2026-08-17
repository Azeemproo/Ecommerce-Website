import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h2>Fernwood</h2>
          <p>Timeless essentials, made to last.</p>
        </div>

        <div className="footer-col">
          <h3>Shop</h3>
          <Link to="/">All Products</Link>
          <Link to="/cart">Cart</Link>
        </div>

        <div className="footer-col">
          <h3>Help</h3>
          <a href="#">Shipping & Returns</a>
          <a href="#">Track Order</a>
          <a href="#">Contact Us</a>
        </div>

        <div className="footer-col">
          <h3>Stay in touch</h3>
          <p>Get updates on new arrivals.</p>
          <form className="footer-subscribe" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email" />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Fernwood. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;