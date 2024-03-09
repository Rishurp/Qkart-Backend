const { User } = require("../models");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcryptjs");
const { REQUEST_HEADER_FIELDS_TOO_LARGE } = require("http-status");

// For testing if api is working or not
// async function getAllUsers() {
//   // console.log(User.find({}));
//   return await User.find({});
// }
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserById(id)
/**
 * Get User by id
 * - Fetch user object from Mongo using the "_id" field and return user object
 * @param {String} id
 * @returns {Promise<User>}
 */
async function getUserById(userId) {
  const data = await User.findById(userId);
  // console.log(data);
  return data;
}

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement getUserByEmail(email)
/**
 * Get user by email
 * - Fetch user object from Mongo using the "email" field and return user object
 * @param {string} email
 * @returns {Promise<User>}
 */
async function getUserByEmail(email) {
  const data = await User.findOne({ email });
  return data;
}
// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Implement createUser(user)
/**
 * Create a user
 *  - check if the user with the email already exists using User.isEmailTaken() method
 *  - If so throw an error using the ApiError class. Pass two arguments to the constructor,
 *    1. “200 OK status code using http-status library
 *    2. An error message, “Email already taken”
 *  - Otherwise, create and return a new User object
 *
 * @param {Object} userBody
 * @returns {Promise<User>}
 * @throws {ApiError}
 *
 * userBody example:
 * {
 *  "name": "crio-users",
 *  "email": "crio-user@gmail.com",
 *  "password": "usersPasswordHashed"
 * }
 *
 * 200 status code on duplicate email - https://stackoverflow.com/a/53144807
 */
const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

async function createUser(user) {
  const { email, password } = user;

  if (await User.isEmailTaken(email)) {
    throw new ApiError(200, "Email is already taken.");
  }
  const hashPassword = await encryptPassword(password);
  const res = { ...user, password: hashPassword };
  // console.log(res);
  return await User.create(res);
}

// TODO: CRIO_TASK_MODULE_CART - Implement getUserAddressById()
/**
 * Get subset of user's data by id
 * - Should fetch from Mongo only the email and address fields for the user apart from the id
 *
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserAddressById = async (id, q) => {
  const user = await User.findOne({ _id: id }, { address: 1, email: 1 });
  // console.log(q);
  if (q) {
    return { address: user.address };
  }
  return { _id: id, address: user.address, email: user.email };
};

/**
 * Set user's shipping address
 * @param {String} email
 * @returns {String}
 */
async function setAddress(userId, address) {
  if (!address) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Address field is required!");
  }
  if (address.length < 20) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Address shouldn't be less than 20 characters"
    );
  }
  const user = await User.findById(userId);
  user.address = address;
  // user.save();
  // console.log(user, "inside setAddress");
  return user.address;
}
module.exports = {
  getUserById,
  getUserByEmail,
  createUser,
  // getAllUsers,
  getUserAddressById,
  setAddress,
};