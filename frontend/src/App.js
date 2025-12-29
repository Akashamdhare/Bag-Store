import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Components/Home';
import Products from './Components/Products';
import ProductDetail from './Components/ProductDetail';
import Cart from './Components/Cart';
import Login from './Components/Login';
import Register from './Components/Register';
import Orders from './Components/Orders';
import './App.css';

// Create axios instance
export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);

  // Check for existing token and user data on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      
      // Add token to axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch cart count
      fetchCartCount();
    }
    
    setLoading(false);
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/cart');
      const count = response.data.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const loginUser = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchCartCount();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    setCartCount(0);
  };

  const updateCartCount = () => {
    fetchCartCount();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header 
          user={user} 
          logout={logout} 
          cartCount={cartCount}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} updateCartCount={updateCartCount} />} />
            <Route path="/products" element={<Products user={user} updateCartCount={updateCartCount} />} />
            <Route path="/products/category/:category" element={<Products user={user} updateCartCount={updateCartCount} />} />
            <Route path="/products/:id" element={<ProductDetail updateCartCount={updateCartCount} />} />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  user={user} 
                  updateCartCount={updateCartCount} 
                />
              } 
            />
            <Route 
              path="/login" 
              element={
                <Login 
                  loginUser={loginUser} 
                />
              } 
            />
            <Route 
              path="/register" 
              element={
                <Register 
                  loginUser={loginUser} 
                />
              } 
            />
            <Route 
              path="/orders" 
              element={
                <Orders 
                  user={user} 
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;