'use strict'

const productsController = require('../controllers/products.js');
const productsValidationSchema = require("../validations/products.js");

module.exports = async function (fastify, opts, done) {
  fastify.get('/products/findProduct/:id', productsController.findProduct);
  fastify.get('/products/findProducts', productsValidationSchema.findProducts, productsController.findProducts);
  fastify.get('/products/findProductsByGenderAndSubCategory', productsController.findProductsByGenderAndSubCategory);
  fastify.get('/products/retrieveImage/:imageName', productsController.retrieveImage);
  fastify.post("/products/insertProduct", productsController.insertProduct);
  fastify.delete('/products/deleteProduct/:id', productsValidationSchema.deleteProduct, productsController.deleteProduct);
//   fastify.post("/signin", productsController.signIn);
//   fastify.post("/signup", productsController.signUpValidation, usersController.signUp);
  done();
}


// Can Also Be:

/*

'use strict'

const UserController = require("../controllers/UserController.js");
const UserValidationSchema = require('../validationSchemas/UserValidationSchema');

const user = function userController (fastify, options, done) {
  fastify.get("/users/:userID", UserValidationSchema.getUserValidation, UserController.getUser);
  //fastify.patch('/users/:UserID', UserValidationSchema, UserController.patchUser);
  fastify.post("/signup", UserValidationSchema.signupValidation, UserController.signup);
  fastify.post('/signin', UserValidationSchema.signinValidation, UserController.signin);
  fastify.delete("/delete/:userID", UserValidationSchema.deleteUserValidation, UserController.deleteUser);
  fastify.get('/login/facebook/callback', UserController.login);
  done();
};

*/