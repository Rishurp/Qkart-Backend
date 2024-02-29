const Joi = require("joi");
const { password } = require("./custom.validation");

// Define request validation schema for user registration
const register = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required(),
    name: Joi.string().required()
  })
};

// Define request validation schema for user login
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().custom(password).required()
  })
};




module.exports = {
  register,
  login,
};
