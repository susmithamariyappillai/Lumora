# Lumora – Fashion & Lifestyle Store

A full-stack MERN e-commerce application built using React, Vite, Node.js, Express.js, and MongoDB.

Lumora is a fashion and lifestyle shopping platform with a clean, modern design using navy, ivory, and dusty pink colours.

## Features

### Customer Features
- User Registration and Login
- JWT Authentication
- Browse Products and Categories
- Product Search and Filtering
- Product Details
- Shopping Cart
- Wishlist
- Cash on Delivery (COD) Checkout
- My Orders
- Order Tracking and Status History
- Order Cancellation
- Return Requests
- User Profile Management

### Shopping Features
- Five product categories
- Product sorting and pagination
- Size and colour selection
- Stock availability validation
- Free shipping above ₹999
- ₹79 shipping fee below ₹999
- Secure server-side price calculation

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- HTML5
- CSS3

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB
- Mongoose

**Authentication**
- JSON Web Token (JWT)
- bcryptjs

**Tools**
- Git
- GitHub
- VS Code
- Postman

## Project Structure

```text
lumora-ecommerce/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── data/
│   ├── seed.js
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/
│       ├── services/
│       ├── data/
│       └── utils/
│
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js 18 or above
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd lumora-ecommerce
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
CLIENT_URL=http://localhost:5174
```

### 3. Seed Product Data

Run inside the backend folder:

```bash
npm run seed
```

This adds or updates the 71 products in the database.

**Note:** `npm run seed:reset` deletes existing products before inserting them again. Use it only when necessary.

### 4. Start Backend

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 5. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5174
```

## Payment Method

Lumora currently supports **Cash on Delivery (COD) only**.

- Customers can place orders using COD.
- The backend validates product availability and stock.
- Product prices are calculated using database values.
- Orders are saved in MongoDB.
- Stock is reduced when an order is placed.

Online payment integration is not included.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get user profile |
| PATCH | `/api/auth/me` | Update profile |
| GET | `/api/products` | Get products |
| GET | `/api/products/categories` | Get categories |
| GET | `/api/products/search` | Search products |
| GET | `/api/products/:idOrSlug` | Get product details |
| POST | `/api/orders` | Place COD order |
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/orders/:id/return` | Request return |

Protected endpoints require authentication.

## Security

- JWT-based authentication
- Password hashing using bcryptjs
- Protected customer routes
- Server-side order price calculation
- Stock availability validation
- User-specific order access
- Environment variables for sensitive credentials

Never upload `.env` files or database credentials to GitHub.

## Important Notes

- Cart and wishlist data are stored in the browser.
- Product ratings and review counts are demo data.
- Order tracking displays database status updates.
- Newsletter and contact forms may be demo-only.
- Product images should be added under `frontend/public/images/`.

## Future Improvements

- Product reviews and ratings
- Email notifications
- Password reset
- Wishlist synchronization with user accounts
- Improved order tracking

## Author

**Susmitha M**

GitHub: https://github.com/susmithamariyappillai

LinkedIn: https://linkedin.com/in/susmitham04

---

*Lumora – A Fashion & Lifestyle Shopping Experience.*