// ProductCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../App';
import './ProductCard.css';

const ProductCard = ({ product, updateCartCount, user, viewMode }) => {
  const [isAdded, setIsAdded] = useState(false);
  const navigate = useNavigate();
  
  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity: 1
      });
      setIsAdded(true);
      updateCartCount();
      // Reset the added state after a delay
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      alert('Failed to add product to cart');
    }
  };
  
  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`} onClick={() => navigate(`/products/${product.id}`)}>
      <div className="product-image-container">
        <img src={product.image_url} alt={product.name} className="product-image" />
        {product.discount && <span className="discount-badge">-{product.discount}%</span>}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        
        {viewMode === 'list' && (
          <p className="product-description">{product.description}</p>
        )}

        
        <div className="product-price-row">
          <div className="product-price">
            <span className="current-price">${product.price}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>
          
          <button 
            className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!user}
          >
            {isAdded ? (
              <span>✓ Added</span>
            ) : user ? (
              <span>Add to Cart</span>
            ) : (
              <span>Login to Buy</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;