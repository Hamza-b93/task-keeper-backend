"use strict";

// const bcrypt = require("bcryptjs");
const AdModel = require("../models/ads.js");
const MessageModel = require("../models/messages.js");
const PlatformModel = require("../models/platforms.js");
const ConversationModel = require("../models/conversations.js");
const UserModel = require("../models/users.js");

const config = require("../config.js");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const fs = require("fs");
const { join } = require("path");

const mv = require("mv");
const util = require("util");
const mvPromisified = util.promisify(mv);

const findMessage = async function (request, reply, next) {
  const id = request.params.id;
  try {
    const message = await MessageModel.findOne({
      _id: id,
    });
    if (
      message &&
      (message.length !== 0 ||
        categmessageory !== null ||
        message !== undefined)
    ) {
      return reply.send(message);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.badRequest(error.message);
    }
  }
};

const findMessages = async (request, reply, next) => {
  try {
    const messages = await MessageModel.find({});
    if (messages && messages.length > 0) {
      return reply.send(messages);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    return reply.notFound("The Requested Resources Do Not Exist!");
  }
};

const findMessagesByConversation = async (request, reply, next) => {
  const id = request.params.id;
  const token = request.headers.authorization;
  try {
    const validateToken = jwt.verify(
      token.replace('Bearer ', ''),
      config.JWT_SECRET,
      config.TEMPORARY_JWT_OPTIONS
    );

    const messages = await MessageModel.find({
      conversationID: id,
    });

    if (!validateToken.iss) {
      if (validateToken.err && validateToken.err.message === 'invalid signature') {
        throw new Error('InvalidTokenSignature');
      } else if (validateToken.err && validateToken.err.message === 'invalid token') {
        throw new Error('InvalidToken');
      }
    } else if (
      String(messages[0].receiverID) !== String(validateToken.userObj.id) &&
      String(messages[0].senderID) !== String(validateToken.userObj.id)
    ) {
      throw new Error('InvalidToken');
    } else {
      if (messages && messages.length !== 0) {
        return reply.send(messages);
      } else {
        throw new Error('ResourceNotFound');
      }
    }
  } catch (error) {
    if (error.message === 'ResourceNotFound') {
      return reply.notFound('The Requested Resource Does Not Exist!');
    } else if (error.message === 'InvalidTokenSignature') {
      return reply.unauthorized('Token Signature Invalid!');
    } else if (error.message === 'InvalidToken') {
      return reply.unauthorized('You Are Not Authorized To Access This Resource!');
    } else {
      return reply.badRequest(error.message);
    }
  }
};

const insertMessage = async (request, reply, next) => {
  const { adID, receiverID, senderID } = request.body;
  const conversationID = request.body.conversationID;
  const text = request.body.text;

  let id = new mongoose.mongo.ObjectId();
  let upperCaseTagsArray = [];

  try {
    const adExists = await AdModel.exists({
      _id: String(adID),
    });
    const conversationExists = await ConversationModel.exists({
      _id: String(conversationID),
    });
    const receiverExists = await UserModel.exists({
      _id: String(receiverID),
    });
    const senderExists = await UserModel.exists({
      _id: String(senderID),
    });
    if (adExists == null) {
      throw new Error("ResourceNotFound1");
    } else if (conversationExists == null) {
      throw new Error("ResourceNotFound2");
    } else if (receiverExists == null) {
      throw new Error("ResourceNotFound3");
    } else if (senderExists == null) {
      throw new Error("ResourceNotFound4");
    } else {
      const count = await MessageModel.countDocuments({});
      // if (count <= 0) {
      //   id = 1;
      // } else {
      //   const latestRecord = await MessageModel.findOne().sort({
      //     createdAt: -1,
      //   });
      //   id = Number(latestRecord._id) + 1;
      // }
      const message = await MessageModel.create({
        _id: id,
        conversationID: conversationID,
        createdAt: new Date(),
        receiverID: receiverID,
        senderID: senderID,
        text: text,
      });
      const updatedCategory = await ConversationModel.updateOne(
        {
          _id: conversationID,
        },
        { $push: { messageThread: id }, updatedAt: new Date() }
      );
      if (updatedCategory.matchedCount == 0) {
        throw new Error("ResourceNotFound");
      } else if (updatedCategory.modifiedCount == 0) {
        throw new Error("BadRequest");
      } else {
        return reply.send("Success!");
      }
    }
    return reply.send("Success!");
  } catch (error) {
    return reply.badRequest(error.message);
  }
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
    }
  }
};

/*
        if (files && (files != undefined || files != null || files.length > 0)) {
        // const source = request[kFileSavedPaths];
        // console.log('name', Object.keys(request.files))
        const destination = join(__dirname,`../uploads/${files.file.name}`);
        const writeFile = await mvPromisified(files.file.tempFilePath, destination, {
            mkdirp: true,
        });
        if (count <= 0) {
            id = 1;
        }
        else {
            const latestRecord = await CategoryModel.findOne().sort({
            createdAt: -1,
            });
            id = Number(latestRecord._id) + 1;
        }
        const category = await CategoryModel.create({
            _id: id,
            createdAt: new Date(),
            gender: gender,
            imageName: files.file.name,
            imagePath: destination,
            sortPosition: sortPosition,
            title: title,
        });
        return reply.send("Success!");
        }
*/

const uploadImages = async (request, reply, next) => {
  try {
    /*
    Only Allow Image File Uploads If The Request Is Multipart Type. Otherwise, Data Is Inserted Without Uploading Image File.
    */
    if (request[kIsMultipartParsed] || request[kIsMultipart] === true) {
      const source = request[kFileSavedPaths];
      Object.keys(request.files).forEach(async function (item, counter) {
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
      return reply.send("Success!");
    } else {
      throw new Error("BadRequest");
    }
  } catch (error) {
    if (error.message == "BadRequest") {
      return reply.notFound("The Request Type Must Be Multipart!");
    } else if (error.message == "IncorrectMimeType") {
      return reply.badRequest("Only .jpg, .jpeg & .png Formats Are Allowed!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
};

const updateMessage = async (request, reply, next) => {
  const { adID, receiverID, senderID } = request.body;
  const conversationID = request.params.conversationID;
  const text = request.body.text;

  // const imagePath = request.body.imagePath;

  const id = request.params.id;
  try {
    const updatedMessage = await MessageModel.updateOne(
      {
        _id: id,
      },
      {
        conversationID: conversationID,
        receiverID: receiverID,
        senderID: senderID,
        text: text,
        updatedAt: new Date(),
      }
    );
    if (updatedMessage.matchedCount == 0) {
      throw new Error("ResourceNotFound");
    } else if (updatedMessage.modifiedCount == 0) {
      throw new Error("BadRequest");
    } else {
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
};

async function deleteMessage(request, reply, next) {
  const id = request.params.id;
  try {
    const deletedMessage = await MessageModel.deleteOne({
      _id: id,
    });
    if (deletedMessage.deletedCount == 0) {
      throw new Error("ResourceNotFound");
    } else {
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
}

module.exports = {
  findMessage,
  findMessages,
  findMessagesByConversation,
  insertMessage,
  retrieveImage,
  updateMessage,
  uploadImages,
  deleteMessage,
};
