"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const mongoose = require("mongoose");

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  mongoose.set('strictQuery', false);

  mongoose.connect(
    `mongodb+srv://hamzab93development:xPhnzGZmDUMm4dge@task-keeper.v31gesj.mongodb.net/?retryWrites=true&w=majority&appName=task-keeper`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  );

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    fastify.log.info("DB Connected!");
  });

  fastify.register(require("@fastify/cors"), {
    origin: true,
  });

  fastify.register(require("fastify-file-upload"), {
    useTempFiles: true,
    // limits: {
    //   fileSize: 1,
    //   files: 1
    // }
  });

  fastify.register(require("@fastify/static"), {
    root: path.join(__dirname, "./uploads/"),
    prefix: "/public/", // optional: default '/'
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });


  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};
