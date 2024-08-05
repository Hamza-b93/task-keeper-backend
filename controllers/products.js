"use strict";

// const bcrypt = require("bcryptjs");
const ProductModel = require("../models/products.js");
const PlatformModel = require("../models/platforms.js");
// const fs = require('fs');
const { join } = require("path");

const mv = require("mv");
const util = require("util");
const mvPromisified = util.promisify(mv);

const findProduct = async function (request, reply, next) {
  const id = request.params.id;
  try {
    const product = await ProductModel.findOne({
      _id: id,
      gender: gender,
    });
    if (product && product.length > 0) {
      return reply.send(product);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.badRequest(error.message);
    };
  };
};

const findProductsByGenderAndSubCategory = async function (
  request,
  reply,
  next
) {
  const gender = request.query.gender;
  const subCategoryID = request.query.subCategoryID;
  try {
    const products = await ProductModel.find({
      gender: gender,
      subCategoryID: subCategoryID,
    });
    if (products && products.length > 0) {
      return reply.send(products);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resources Do Not Exist!");
    } else {
      next();
      return reply.badRequest(error.message);
    };
  };
};

const findProducts = async (request, reply, next) => {
  try {
    const products = await ProductModel.find({});
    if (
      products &&
      (products != null || products != undefined || products.length > 0)
    ) {
      return reply.send(products);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    return reply.notFound("The Requested Resources Do Not Exist!");
  };
};

const insertProduct = async (request, reply, next) => {
  // Requires File Uplaod. Implement Fastify-Formidable.
  /*
    Required Fields:
        - ProductID.
        - Product Name.
        - Article No.
        - Details.
        - Image.
    */
  const { articleNumber, colors, details, gender, keywords } = request.body;
  const name = request.body.name;
  const rank = request.body.rank;
  const seoURL = request.body.seoURL;
  const size = request.body.size;
  const subCategoryID = request.body.subCategoryID;
  const files = request.raw.files;
  let id;
  try {
    const subCategoryExists = await SubCategoryModel.exists({
      _id: subCategoryID,
    });
    if (subCategoryExists == null) {
      throw new Error("SubCategoryNotFound");
    } else {
      const count = await ProductModel.countDocuments({});
      // Only Allow Image File Uploads If The Request Is Multipart Type. Otherwise, Data Is Inserted Without Uploading Image File.
      if (count <= 0) {
        id = 1;
      } else {
        const latestRecord = await ProductModel.findOne().sort({
          createdAt: -1,
        });
        id = Number(latestRecord._id) + 1;
      }
      const product = await ProductModel.create({
        _id: id,
        articleNumber: articleNumber,
        colors: colors,
        createdAt: new Date(),
        details: details,
        gender: gender,
        keywords: keywords,
        name: name,
        rank: rank,
        seoURL: seoURL,
        size: size,
        subCategoryID: subCategoryID,
      });
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "SubCategoryNotFound") {
      return reply.notFound("No Sub-Category With This ID Exists!");
    }
    return reply.badRequest(error.message);
  };
};

const retrieveImage = async (request, reply, next) => {
  const imageName = request.params.imageName;
  try {
    return reply.sendFile(imageName);
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resources Do Not Exist!");
    } else {
      return reply.badRequest(error.message);
    };
  };
};

const updateProduct = async (request, reply, next) => {
  const { articleNumber, colors, details, gender, imageName, imagePath } =
    request.body;
  const keywords = requesy.body.keywords;
  const name = request.body.name;
  const rank = request.body.rank;
  const seoURL = request.body.seoURL;
  const size = request.body.size;
  const subCategoryID = request.body.subCategoryID;
  const id = request.params.id;
  try {
    const updatedModel = await ProductModel.updateOne(
      { _id: id },
      {
        articleNumber: articleNumber,
        colors: colors,
        details: details,
        gender: gender,
        imageName: imageName,
        imagePath: imagePath,
        keywords: keywords,
        name: name,
        rank: rank,
        seoURL: seoURL,
        size: size,
        subCategoryID: subCategoryID,
        updatedAt: new Date(),
      }
    );
    if (updatedAd.matchedCount == 0) {
      throw new Error("ResourceNotFound");
    } else if (updatedAd.modifiedCount == 0) {
      throw new Error("BadRequest");
    } else {
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else if (error.message == "BadRequest") {
      return reply.badRequest(
        "Resource Not Updated! Kindly Check That The Values You Input Match Their Respective Validation Rules!"
      );
    } else {
      return reply.internalServerError(error.message);
    };
  };
};

const uploadImages = async (request, reply, next) => {
  try {
    /*
  Only Allow Image File Uploads If The Request Is Multipart Type. Otherwise, Data Is Inserted Without Uploading Image File.
  */
    if (request[kIsMultipartParsed] || request[kIsMultipart] === true) {
      const source = request[kFileSavedPaths];
      Object.keys(request.files).forEach(async function (item, counter) {
        console.log(request.files[item]);
        if (
          request.files[item].mimetype !== "image/jpeg" ||
          request.files[item].mimetype !== "image/png" ||
          request.files[item].mimetype !== "image/jpg"
        ) {
          // fs.unlinkSync(join(__dirname,`../uploads/${request.files[item].originalFilename}`));
          // console.log('here', counter)
          // return reply.badRequest("Only .jpg, .jpeg & .png Formats Are Allowed!");
        } else {
          const destination = join(
            __dirname,
            `../uploads/${request.files[item].originalFilename}`
          );
          await mvPromisified(source[counter], destination, {
            mkdirp: true,
          });
        }
      });
      return reply.send("Complete!");
    } else {
      throw new Error("BadRequest");
    }
  } catch (error) {
    if (error.message == "BadRequest") {
      return reply.notFound("The Request Type Must Be Multipart!");
    } else if (error.message == "IncorrectMimeType") {
      console.log(error);
      return reply.badRequest("Only .jpg, .jpeg & .png Formats Are Allowed!");
    } else {
      return reply.internalServerError(error.message);
    };
  };
};

async function deleteProduct(request, reply, next) {
  const id = request.params.id;
  try {
    const assignedToSubCategory = await SubCategoryModel.find({
      categoryID: id,
    });
    if (
      assignedToSubCategory ||
      assignedToSubCategory != null ||
      assignedToSubCategory != undefined ||
      assignedToSubCategory.length > 0
    ) {
      throw new Error("AssignedToSubCategory");
    } else {
      const deletedProduct = await ProductModel.deleteOne({
        _id: id,
      });
      if ((deletedProduct.deletedCount = 0)) {
        throw new Error("ResourceNotFound");
      } else {
        return reply.send("Resource Deleted Successfully!");
      };
    };
  } catch (error) {
    if (error.message == "AssignedToSubCategory") {
      return reply.forbidden(
        "Cannot Deleted Product As It Has Sub Categories Assigned To It."
      );
    } else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    };
  };
};

module.exports = {
  findProduct,
  findProducts,
  findProductsByGenderAndSubCategory,
  insertProduct,
  retrieveImage,
  updateProduct,
  uploadImages,
  deleteProduct,
};
