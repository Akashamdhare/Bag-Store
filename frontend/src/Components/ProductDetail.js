import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../App';
import './ProductDetail.css';

const ProductDetail = ({ updateCartCount }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        showNotification('Failed to load product', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock_quantity) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);

    try {
      await api.post('/cart', {
        product_id: product.id,
        quantity: quantity
      });

      if (updateCartCount) {
        updateCartCount();
      }

      showNotification(`${product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      showNotification('Failed to add product to cart', 'error');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <div className="error-container">
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist or has been removed.</p>
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span className="separator">/</span>
          <span onClick={() => navigate('/products')}>Products</span>
          <span className="separator">/</span>
          <span className="current">{product.name}</span>
        </div>
        
        <div className="product-detail-content">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className={selectedImage === 0 ? 'active' : ''}
                onClick={() => setSelectedImage(0)}
              />
            </div>
            
            {product.additional_images && product.additional_images.length > 0 && (
              <div className="image-gallery">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(0)}
                />
                {product.additional_images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`${product.name} ${index + 1}`} 
                    className={`thumbnail ${selectedImage === index + 1 ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index + 1)}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-name">{product.name}</h1>
            </div>
            
            <div className="product-price-section">
              <p className="product-price">${product.price}</p>
              {product.original_price && product.original_price > product.price && (
                <p className="original-price">${product.original_price}</p>
              )}
              {product.discount_percentage && (
                <span className="discount-badge">-{product.discount_percentage}%</span>
              )}
            </div>
            
            <div className="product-meta">
              <p className="product-category">
                <span className="label">Category:</span>
                <span className="value">{product.category}</span>
              </p>
              <p className="product-brand">
                <span className="label">Brand:</span>
                <span className="value">{product.brand || 'Unknown'}</span>
              </p>
              <p className="product-sku">
                <span className="label">SKU:</span>
                <span className="value">{product.sku || 'N/A'}</span>
              </p>
            </div>
            
            <div className="product-stock">
              {product.stock_quantity > 0 ? (
                <div className="in-stock">
                  <span className="stock-indicator"></span>
                  <span>In Stock ({product.stock_quantity} available)</span>
                </div>
              ) : (
                <div className="out-of-stock">
                  <span className="stock-indicator"></span>
                  <span>Out of Stock</span>
                </div>
              )}
            </div>

            {/* CHANGE: Moved the label outside the flex container */}
            <label htmlFor="quantity" className="quantity-label">Quantity:</label>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn" 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="quantity" 
                    min="1" 
                    max={product.stock_quantity}
                    value={quantity} 
                    onChange={handleQuantityChange}
                    disabled={product.stock_quantity <= 0}
                  />
                  <button 
                    className="quantity-btn" 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock_quantity}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button 
                className={`add-to-cart-btn ${addingToCart ? 'loading' : ''}`} 
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0 || addingToCart}
              >
                {addingToCart ? (
                  <>
                    <div className="btn-spinner"></div>
                    Adding...
                  </>
                ) : product.stock_quantity <= 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <span className="cart-icon">🛒</span>
                    Add to Cart
                  </>
                )}
              </button>
              
              <button className="wishlist-btn">
                <span className="heart-icon">♡</span>
              </button>
            </div>
            
            <div className="product-features">
              <div className="feature">
                <span className="feature-icon">🚚</span>
                <span className="feature-text">Free Shipping</span>
              </div>
              <div className="feature">
                <span className="feature-icon">↩️</span>
                <span className="feature-text">30-Day Return</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔒</span>
                <span className="feature-text">Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-details-tabs">
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                {product.features && product.features.length > 0 && (
                  <div className="product-features-list">
                    <h4>Key Features</h4>
                    <ul>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <h3>Product Specifications</h3>
                <table className="specifications-table">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <td className="spec-label">{key}</td>
                        <td className="spec-value">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <h3>Customer Reviews</h3>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="reviews-list">
                    {product.reviews.map((review, index) => (
                      <div key={index} className="review">
                        <div className="review-header">
                          <span className="review-author">{review.author}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < review.rating ? 'star filled' : 'star'}>★</span>
                            ))}
                          </div>
                          <span className="review-date">{review.date}</span>
                        </div>
                        <p className="review-content">{review.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No reviews yet. Be the first to review this product!</p>
                )}
                <button className="write-review-btn">Write a Review</button>
              </div>
            )}
          </div>
        </div>
        
        {product.related_products && product.related_products.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {product.related_products.map(relatedProduct => (
                <div key={relatedProduct.id} className="related-product-card">
                  <img src={relatedProduct.image_url} alt={relatedProduct.name} />
                  <h3>{relatedProduct.name}</h3>
                  <p className="price">${relatedProduct.price}</p>
                  <button onClick={() => navigate(`/products/${relatedProduct.id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;