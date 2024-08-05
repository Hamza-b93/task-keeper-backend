'use strict'

const uploadsController = require('../controllers/uploads.js');
// const subCategoriesValidationSchema = require("../validations/subCategories.js");

module.exports = async function (fastify, opts, done) {
    // fastify.get('/public', uploadsController.uploadImages);
    fastify.post('/uploads', uploadsController.uploadImages);
//   fastify.post("/signin", bannersController.signIn);
//   fastify.post("/signup", bannersController.signUpValidation, usersController.signUp);
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