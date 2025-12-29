# Bag Store E-Commerce Platform

A full-stack e-commerce application for selling bags, built with React frontend and Node.js/Express backend with MySQL database.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Working](#project-working)
- [Workflow](#workflow)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**
- **Product Catalog**
- **Product Details**
- **Shopping Cart**
- **Order Management**
- **Responsive Design**
- **Search and Filter**

## Tech Stack

### Frontend
- React 19.2.3
- React Router DOM 7.11.0
- Axios 1.13.2
- CSS3 for styling

### Backend
- Node.js
- Express 5.2.1
- MySQL 3.16.0
- JWT (jsonwebtoken 9.0.3)
- bcryptjs 3.0.3
- CORS 2.8.5
- dotenv 17.2.3

### Database
- MySQL with connection pooling

## Project Structure

```
bag-store/
├── backend/
│   ├── routes/
│   │   ├── cart.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   └── users.js
│   ├── sql/
│   │   └── Database Schema.sql
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Cart.js/css
│   │   │   ├── Footer.js/css
│   │   │   ├── Header.js/css
│   │   │   ├── Home.js/css
│   │   │   ├── Login.js/css
│   │   │   ├── Orders.js/css
│   │   │   ├── ProductCard.js/css
│   │   │   ├── ProductDetail.js/css
│   │   │   ├── Products.js/css
│   │   │   └── Register.js/css
│   │   ├── App.js/css
│   │   ├── index.js/css
│   │   └── setupTests.js
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bag-store
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

## Database Setup

1. **Create MySQL Database**
   - Create a new database named `bag_store`

2. **Configure Environment Variables**
   - Copy `.env` file in backend directory and update:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=bag_store
   PORT=5000
   JWT_SECRET=your_jwt_secret_key
   ```

3. **Run Database Schema**
   - Execute the SQL script in `backend/sql/Database Schema.sql` in your MySQL client
   - This will create all necessary tables and insert sample products

## Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   Server runs on http://localhost:5000

2. **Start Frontend**
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on http://localhost:3000

3. **Access the Application**
   - Open http://localhost:3000 in your browser

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Cart
- `GET /api/cart` - Get user's cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## Project Working

### Frontend Architecture
- **App.js**: Main component handling routing, authentication state, and cart count
- **Components**: Modular React components for different pages/features
- **API Integration**: Axios instance configured for backend communication
- **State Management**: Local state with useState, localStorage for persistence

### Backend Architecture
- **Server.js**: Express server setup with middleware and route mounting
- **Routes**: Separate route files for different API endpoints
- **Database**: MySQL connection pool for efficient database operations
- **Authentication**: JWT tokens for secure API access

### Data Flow
1. User interacts with React components
2. Components make API calls to Express backend
3. Backend queries MySQL database
4. Data returned to frontend for rendering

### Key Features Implementation
- **Authentication**: JWT tokens stored in localStorage
- **Cart Management**: Real-time cart count updates
- **Product Display**: Responsive grid/list views
- **Order Processing**: Complete order lifecycle from cart to history

## Workflow

### Development Workflow
1. **Planning**: Define features and user stories
2. **Backend Development**:
   - Design database schema
   - Implement API endpoints
   - Test with Postman/Insomnia
3. **Frontend Development**:
   - Create React components
   - Implement UI/UX design
   - Integrate with backend APIs
4. **Testing**: Unit tests and integration testing
5. **Deployment**: Build and deploy to production

### Git Workflow
- Use feature branches for new features
- Pull requests for code review
- Main branch for production-ready code

### Code Standards
- Use ESLint for JavaScript/React
- Follow React best practices
- Write clean, readable code with comments
- Use meaningful variable and function names

### Deployment
- Build frontend with `npm run build`
- Deploy backend to server with Node.js support
- Configure production database
- Set up environment variables for production

## License

This project is licensed under the ISC License.