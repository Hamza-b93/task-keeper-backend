const jwt = require("jsonwebtoken");

async function signJWT(fastify, user, options) {
  return jwt.sign(user, fastify.config.secret, options);
}

async function decodeJWT(fastify, token) {
  return jwt.decode(token, { complete: true });
}

async function validateJWT(fastify, token) {
  return jwt.verify(token, fastify.config.secret);
}

async function jwtPlugin(fastify, options, next) {
  fastify.decorate("signJWT", signJWT);
  fastify.decorate("decodeJWT", decodeJWT);
  fastify.decorate("validateJWT", validateJWT);

  next();
}

module.exports = jwtPlugin;
