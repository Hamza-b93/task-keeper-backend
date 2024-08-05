"use strict";

module.exports = async function (fastify, opts) {
  fastify.get(
    "/",
    // {
    //   onRequest: [fastify.authenticate],
    // },
    async function (request, reply) {
      // return "this is an example";
      return request.user;
    }
  );
};
