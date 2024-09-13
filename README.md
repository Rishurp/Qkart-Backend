
# QKART - Backend

The backend for the QKART e-commerce web application. This backend provides a RESTful API for managing products, user authentication, shopping cart functionality, and order processing. Built with Node.js, Express.js, and MongoDB, it ensures a secure and efficient server-side architecture to support the QKART frontend.

## Features

- **User Authentication**: Secure user login and registration using JWT and Passport.js.
- **Product Management**: Endpoints to manage products in the database.
- **Shopping Cart API**: Add, update, and remove items from the user's shopping cart.
- **Order Processing**: Handle checkout and order placement.
- **Database**: MongoDB for storing users, products, and orders.

## Tech Stack

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Backend framework for building the API.
- **MongoDB**: NoSQL database for persisting data.
- **Mongoose**: MongoDB object modeling tool.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Passport.js**: Authentication middleware.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register`: Register a new user.
- `POST /api/v1/auth/login`: Log in an existing user.
- `POST /api/v1/auth/logout`: Log out the current user.

### Products
- `GET /api/v1/products`: Retrieve all products.
- `GET /api/v1/products/:id`: Retrieve details of a specific product.
- `POST /api/v1/products`: Add a new product (admin only).
- `PUT /api/v1/products/:id`: Update an existing product (admin only).
- `DELETE /api/v1/products/:id`: Delete a product (admin only).

### Cart
- `GET /api/v1/cart`: Get the current user's cart.
- `POST /api/v1/cart`: Add an item to the cart.
- `PUT /api/v1/cart/:itemId`: Update an item in the cart.
- `DELETE /api/v1/cart/:itemId`: Remove an item from the cart.

### Checkout
- `POST /api/v1/checkout`: For checkout.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rishurp/Qkart-Backend.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Qkart-Backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables. Create a `.env` file in the root directory with the following:

   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. The backend server will run at `http://localhost:8082`.

## Scripts

- `npm start`: Starts the production server.
- `npm run dev`: Starts the development server with hot reloading using Nodemon.

## License

This project is licensed under the MIT License.
