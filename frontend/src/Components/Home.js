import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../App';
import ProductCard from '../Components/ProductCard';
import './Home.css';

const Home = ({ user, updateCartCount }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Get first 4 products as featured
        setFeaturedProducts(response.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Mini Bag Store</h1>
          <p>Find the perfect bag for every occasion</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} user={user} updateCartCount={updateCartCount} />
              ))}
            </div>
          )}
          <div className="view-all-container">
            <Link to="/products" className="view-all-btn">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="categories-grid">
            <Link to="/products/category/Tote" className="category-card">
              <h3>Tote Bags</h3>
            </Link>
            <Link to="/products/category/Backpack" className="category-card">
              <h3>Backpacks</h3>
            </Link>
            <Link to="/products/category/Crossbody" className="category-card">
              <h3>Crossbody Bags</h3>
            </Link>
            <Link to="/products/category/Clutch" className="category-card">
              <h3>Clutches</h3>
            </Link>
            <Link to="/products/category/Duffel" className="category-card">
              <h3>Duffel Bags</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;