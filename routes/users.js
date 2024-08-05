"use strict";

const usersController = require("../controllers/users.js");
const usersValidationSchema = require("../validations/users.js");

module.exports = async function (fastify, opts) {
  fastify.get('/users/findUser/:id', usersController.findUser);
  fastify.get('/users/findUsers', usersValidationSchema.findUsers, usersController.findUsers);
  fastify.post("/users/signin", usersValidationSchema.signin, usersController.signin);
  fastify.post("/users/signup", usersController.signup);
  fastify.put("/users/updateUser/:id", usersController.updateUser);
  fastify.put("/users/updateImage/:id", usersController.updateImage);
  fastify.delete("/users/deleteUser/:id", usersValidationSchema.deleteUser, usersController.deleteUser);
};

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
