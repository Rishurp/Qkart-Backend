const httpStatus = require("http-status");
const { Cart, Product } = require("../models");
const ApiError = require("../utils/ApiError");
const config = require("../config/config");

// TODO: CRIO_TASK_MODULE_CART - Implement the Cart service methods

/**
 * Fetches cart for a user
 * - Fetch user's cart from Mongo
 * - If cart doesn't exist, throw ApiError
 * --- status code  - 404 NOT FOUND
 * --- message - "User does not have a cart"
 *
 * @param {User} user
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const getCartByUser = async (user) => {
  // console.log(user);
  let userCart = await Cart.findOne({ email: user.email });
  if(!userCart){
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart")
  }
  return await userCart;
};

/**
 * Adds a new product to cart
 * - Get user's cart object using "Cart" model's findOne() method
 * --- If it doesn't exist, create one
 * --- If cart creation fails, throw ApiError with "500 Internal Server Error" status code
 *
 * - If product to add already in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product already in cart. Use the cart sidebar to update or remove product from cart"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - Otherwise, add product to user's cart
 *
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
const addProductToCart = async (user, productId, quantity) => {
  // console.log(user, productId, quantity);
  let userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    try {
      userCart= await Cart.create({
        email: user.email,
        cartItmes: [],
      });
      await userCart.save();
    } catch (err) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong during creating the cart"
      );
    }
  }
  if (!userCart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bad request");
  }

  const exists = userCart.cartItems.some((item) =>
    item.product._id.equals(productId)
  );
  if (exists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is already present in cart, Use the cart side bar to update or remove from the cart"
    );
  }
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Product is not present in database"
    );
  }
  userCart.cartItems.push({
    product: product,
    quantity: quantity,
  });
  userCart.save();
  return await userCart;
};

/**
 * Updates the quantity of an already existing product in cart
 * - Get user's cart object using "Cart" model's findOne() method
 * - If cart doesn't exist, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart. Use POST to create cart and add a product"
 *
 * - If product to add not in "products" collection in MongoDB, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product doesn't exist in database"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * - Otherwise, update the product's quantity in user's cart to the new quantity provided and return the cart object
 *
 *
 * @param {User} user
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 * @throws {ApiError}
 */
 const updateProductInCart = async (user, productId, quantity) => {

  const userCart = await Cart.findOne({ email: user.email });
  if (!userCart) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product")
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product doesn't exist in database");
  }

  const productExist = userCart.cartItems.find((item) => item.product._id.equals(productId));
  if (!productExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  productExist.quantity = quantity;
  userCart.save();
  return await userCart
};

/**
 * Deletes an already existing product in cart
 * - If cart doesn't exist for user, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "User does not have a cart"
 *
 * - If product to update not in user's cart, throw ApiError with
 * --- status code  - 400 BAD REQUEST
 * --- message - "Product not in cart"
 *
 * Otherwise, remove the product from user's cart
 *
 *
 * @param {User} user
 * @param {string} productId
 * @throws {ApiError}
 */
const deleteProductFromCart = async (user, productId) => {
  const userCart = await Cart.findOne({email: user.email});
  if(!userCart){
    throw new ApiError(httpStatus.BAD_REQUEST, "User does not have a cart. Use POST to create cart and add a product");
  }
  const productExist = userCart.cartItems.findIndex((item) => item.product._id.equals(productId));
  if (productExist === -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product not in cart");
  }
  userCart.cartItems.splice(productExist, 1);
  userCart.save();
  return await userCart;
};

// TODO: CRIO_TASK_MODULE_TEST - Implement checkout function
/**
 * Checkout a users cart.
 * On success, users cart must have no products.
 *
 * @param {User} user
 * @returns {Promise}
 * @throws {ApiError} when cart is invalid
 */
 const checkout = async (user) => {
  // console.log("data  ", user);
  const userCart = await Cart.findOne({ email: user.email });
  // console.log("user Data", userCart);
  if (!userCart) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not have a cart");
  }
  if (userCart.cartItems.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User cart is empty");
  }
  // const user = await User.findOne({email: user.email})
  if (!(await user.hasSetNonDefaultAddress())) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address is not set");
  }

  let totalCost = 0;
  userCart.cartItems.forEach((item) => {totalCost += item.product.cost * item.quantity});

  if (user.walletMoney < totalCost) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wallet Balance is Insufficient");
  }
  userCart.cartItems = [];
  user.walletMoney -= totalCost;
  user.save();
  userCart.save();
  return userCart;
}

module.exports = {
  getCartByUser,
  addProductToCart,
  updateProductInCart,
  deleteProductFromCart,
  checkout,
};
