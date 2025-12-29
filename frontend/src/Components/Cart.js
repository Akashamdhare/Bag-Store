import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../App';
import './Cart.css';

const Cart = ({ user, updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const alertShown = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !alertShown.current) {
      alert('To open cart need to login');
      alertShown.current = true;
      navigate('/login');
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await api.get('/cart');
        setCartItems(response.data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleQuantityChange = async (id, quantity) => {
    if (quantity <= 0) {
      await handleRemoveItem(id);
    } else {
      try {
        await api.put(`/cart/${id}`, { quantity });
        // Refresh cart
        const response = await api.get('/cart');
        setCartItems(response.data);
        updateCartCount();
      } catch (error) {
        console.error('Failed to update cart item:', error);
        alert('Failed to update cart item');
      }
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      // Refresh cart
      const response = await api.get('/cart');
      setCartItems(response.data);
      updateCartCount();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      alert('Failed to remove cart item');
    }
  };

  const handlePlaceOrder = () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    setShowCheckoutForm(true);
  };

  const handleConfirmOrder = async () => {
    try {
      const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      }));

      await api.post('/orders', { items });
      setOrderPlaced(true);
      setCartItems([]);
      updateCartCount();
    } catch (error) {
      setOrderError(error.response?.data?.message || 'Failed to place order');
    }
  };

  const handleBackToCart = () => {
    setShowCheckoutForm(false);
    setOrderError('');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (orderPlaced) {
    return (
      <div className="cart">
        <div className="container">
          <div className="order-success">
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order has been placed and will be processed shortly.</p>
            <Link to="/orders" className="view-orders-btn">
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showCheckoutForm) {
    return (
      <div className="cart">
        <div className="container">
          <h1>Checkout</h1>
          <div className="checkout-form">
            <div className="checkout-section">
              <h2>User Details</h2>
              <div className="user-info">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
              </div>
            </div>
            <div className="checkout-section">
              <h2>Order Summary</h2>
              <div className="checkout-items">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item">
                    <div className="item-image">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price}</p>
                      <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-total">
                <h3>Total: ${getTotalPrice()}</h3>
              </div>
            </div>
            {orderError && <div className="error-message">{orderError}</div>}
            <div className="checkout-actions">
              <button className="back-btn" onClick={handleBackToCart}>
                Back to Cart
              </button>
              <button className="confirm-btn" onClick={handleConfirmOrder}>
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <h1>Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty.</p>
            <Link to="/products" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  
                  <div className="item-details">
                    <Link to={`/products/${item.product_id}`} className="item-name">
                      {item.name}
                    </Link>
                    <p className="item-price">${item.price}</p>
                  </div>
                  
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <button 
                    className="remove-item-btn" 
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${getTotalPrice()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${getTotalPrice()}</span>
              </div>
              
              {orderError && <div className="error-message">{orderError}</div>}
              
              <button
                className="checkout-btn"
                onClick={handlePlaceOrder}
                disabled={!user}
              >
                {user ? 'Place Order' : 'Login to Checkout'}
              </button>
              
              <Link to="/products" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;