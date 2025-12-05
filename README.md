# E-Commerce Backend API

A comprehensive Express.js-based e-commerce backend API built with TypeScript, featuring role-based authentication, product management, shopping cart functionality, and real-time WebSocket support.

## Project Overview

This is a full-featured e-commerce backend API that provides:

- **User Management**: Registration, authentication, and profile management
- **Product Management**: CRUD operations for products, variants, and combos
- **Shopping Features**: Cart management, wishlist, and product reviews
- **Admin Panel**: Administrative controls for products, banners, blogs, and categories
- **File Management**: Image uploads to Cloudinary
- **Real-time Updates**: WebSocket integration for live notifications
- **Security**: JWT authentication, password hashing, and role-based authorization
- **Data Export**: CSV and Excel export functionality

---

## Tech Stack

### Backend Framework
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Node.js** - Runtime environment

### Database & ORM
- **MySQL 2** - Relational database
- **Sequelize** - ORM for database operations

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing and encryption

### Real-time Communication
- **Socket.io** - WebSocket support for real-time features

### File & Image Management
- **Cloudinary** - Cloud image storage and management
- **Multer** - File upload middleware

### Data Processing
- **ExcelJS** - Excel file generation
- **csv-writer** - CSV export functionality

### Utilities
- **node-cron** - Scheduled jobs (price updates)
- **Joi** - Data validation
- **Morgan** - HTTP request logging
- **Winston** - Application logging
- **Slugify** - URL-friendly strings
- **CORS** - Cross-origin resource sharing
- **uuid** - Unique identifier generation


## Setup Instructions

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **MySQL** (v5.7 or higher)
- **Git**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd demo
```

### Step 2: Install Dependencies

```bash
npm install
```

or if using yarn:

```bash
yarn install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the root directory.


### Step 4: Setup MySQL Database

1. Create a new MySQL database:
```sql
CREATE DATABASE ecommerce;
```

2. Run the database schema from `allquery.sql`:
```bash
mysql -u root -p ecommerce < allquery.sql
```

### Step 5: Configure Cloudinary (Optional)

If you want to use image uploads:
1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your API credentials from the dashboard
3. Add them to the `.env` file

---

## Configuration

### Database Configuration (`src/config/db.config.ts`)
Configure your MySQL database connection settings.

### JWT Configuration (`src/config/jwt.config.ts`)
Set up JWT token expiration and signing options.

### Server Configuration (`src/config/config.ts`)
Define server port, environment, and other global settings.

---

## Running the Project

### Development Mode

Run the application in development mode with hot-reload:

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT)

## API Features

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Product Routes
- `GET /products` - Get all products
- `GET /products/:id` - Get product details
- `POST /admin/products` - Create product (admin)
- `PUT /admin/products/:id` - Update product (admin)
- `DELETE /admin/products/:id` - Delete product (admin)

### Shopping Features
- `GET /cart` - Get shopping cart
- `POST /cart/add` - Add item to cart
- `DELETE /cart/remove` - Remove item from cart
- `GET /wishlist` - Get user wishlist
- `POST /wishlist/add` - Add product to wishlist
- `POST /reviews` - Add product review

### Admin Routes
- `GET /admin/products` - List all products
- `POST /admin/banners` - Create banner
- `POST /admin/categories` - Create category
- `POST /admin/blogs` - Create blog post

### User Routes
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `GET /users/addresses` - Get user addresses
- `POST /users/addresses` - Add new address

---

## Database Schema

The application uses the following main entities:

- **Users** - User accounts and authentication
- **Products** - Product catalog with variants and combos
- **Categories** - Product categorization
- **Cart** - Shopping cart items
- **Wishlist** - User wishlists
- **Reviews** - Product reviews and ratings
- **Banners** - Homepage and promotional banners
- **Blogs** - Blog posts and content
- **Addresses** - User delivery addresses
- **OTPs** - One-time passwords for authentication

Run `allquery.sql` to set up the complete schema.

---

## Features in Detail

### Real-time Updates
WebSocket integration via Socket.io provides real-time notifications for:
- Product price changes
- Inventory updates

### Scheduled Jobs
- **Price Updater**: Automatically updates product prices at scheduled intervals using node-cron

### Image Management
- Images are uploaded to Cloudinary
- Supports multiple image formats
- Automatic image optimization

### Security Features
- JWT-based authentication
- Password encryption with bcryptjs
- CORS protection
- Request validation with Joi middleware
- Role-based access control (Admin/User)

### Logging
- Application logs stored in the `logs/` directory
- Winston logger for structured logging
- Morgan HTTP request logging

---

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database credentials in `.env`
- Ensure the `ecommerce` database exists

### Port Already in Use
- Change the PORT in `.env` to an available port
- Or kill the process using the port


### JWT Token Errors
- Ensure JWT_SECRET is set in `.env`
- Check token expiration time in `jwt.config.ts`

---

## Support & Contact

For issues, questions, or contributions, please reach out to the development team.

---

## License

MIT