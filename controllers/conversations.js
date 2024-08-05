"use strict";

// const bcrypt = require("bcryptjs");
const ConversationModel = require("../models/conversations.js");
const UserModel = require("../models/users.js");
const AdModel = require("../models/ads.js");
const MessageModel = require("../models/messages.js");

const config = require("../config.js");
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const fs = require("fs");
const { join } = require("path");

const mv = require("mv");
const util = require("util");
const mvPromisified = util.promisify(mv);

async function archiveConversation(request, reply, next) {
  const id = request.params.id;
  try {
    const updatedCategory = await ConversationModel.updateOne(
      {
        _id: id,
      },
      {
        isArchived: true,
        updatedAt: new Date(),
      }
    );
    if (updatedCategory.matchedCount == 0) {
      throw new Error("ResourceNotFound");
    } else if (updatedCategory.modifiedCount == 0) {
      throw new Error("BadRequest");
    } else {
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "AssignedToPlatform") {
      return reply.forbidden(
        "Cannot Deleted Category As It Has Platforms Assigned To It."
      );
    } else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
}

const findConversation = async function (request, reply, next) {
  const id = request.params.id;

  
  try {
    const conversation = await ConversationModel.findOne({
      _id: id,
    }).populate({
      path: "messageThread",
    });
    if (
      conversation &&
      (conversation.length !== 0 ||
        conversation !== null ||
        conversation !== undefined)
    ) {

        let conversationObject = conversation.toObject();

        const senderUser = await UserModel.findById(conversation.initiatorID);
        conversationObject.senderName = `${senderUser?.firstName} ${senderUser?.middleName} ${senderUser?.lastName}`;

        const targetUser = await UserModel.findById(conversation.targetID);
        conversationObject.targetName = `${targetUser?.firstName} ${targetUser?.middleName} ${targetUser?.lastName}`;
      
        return reply.send(
        conversationObject
        );
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

const findConversationsForAdsByInitiatorAndTarget = async function (
  request,
  reply,
  next
) {
  const adID = request.params.adID;
  const initiatorID = request.params.initiatorID;
  const targetID = request.params.targetID;
  const token = request.headers.authorization;

  try {
    const validateToken = await jwt.verify(
      token.replace('Bearer ', ''),
      config.JWT_SECRET,
      config.TEMPORARY_JWT_OPTIONS
    );

    if (!validateToken.iss && validateToken.err.message === 'invalid signature') {
      throw new Error('InvalidTokenSignature');
    }
    else if (!validateToken.iss && validateToken.err.message === "invalid token") {
      throw new Error("InvalidToken");
    }
    else if (validateToken.iss && String(initiatorID) !== validateToken.userObj.id) {
      throw new Error("InvalidToken");
    }
    else if (validateToken.iss && String(targetID) !== validateToken.userObj.id) {
      throw new Error("InvalidToken");
    }
    else {
      const conversation = await ConversationModel.findOne({
        adID: Number(adID),
        initiatorID: Number(initiatorID),
        targetID: Number(targetID),
      })
        .populate({
          path: 'messageThread'
        });
      if (
        conversation &&
        (conversation.length !== 0 ||
          conversation !== null ||
          conversation !== undefined)
      ) {
        return reply.send(conversation);
      } else {
        throw new Error("ResourceNotFound");
      }
    };
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    }
    else if (error.message == "InvalidTokenSignature") {
      return reply.unauthorized("Token Signature Invalid!");
    }
    else if (error.message == "InvalidToken") {
      return reply.unauthorized("You Are Not Authorized To To Access This Resource!");
    }
    else {
      return reply.badRequest(error.message);
    }
  }
};

const findConversations = async (request, reply, next) => {
  try {
    const conversations = await ConversationModel.find({});
    if (conversations && conversations.length > 0) {      
      return reply.send(conversations);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    return reply.notFound("The Requested Resources Do Not Exist!");
  }
};

const findConversationsByUser = async function (request, reply, next) {
  const userID = request.params.userID;

  try {
    const projection = { messageThread: 0 }; // Exclude the messageThread field

    const initiatorConversations = await ConversationModel.find(
      {
        initiatorID: userID,
      },
      projection
    )
      .sort({ createdAt: -1 })
      .lean();

    const targetConversations = await ConversationModel.find(
      {
        targetID: userID,
      },
      projection
    )
      .sort({ createdAt: -1 })
      .lean();

    let allConversations = [...initiatorConversations, ...targetConversations];

    // Sort all conversations by createdAt in descending order
    allConversations.sort((a, b) => b.createdAt - a.createdAt);
    
    allConversations = allConversations.map(async conversation => {
      if (conversation.targetID) {

        const senderUser = await UserModel.findById(conversation.initiatorID);
        conversation.senderName = `${senderUser?.firstName ? senderUser.firstName : "" } ${senderUser?.middleName ? senderUser.middleName : ""} ${senderUser?.lastName ? senderUser?.lastName : "" }`;

        const targetUser = await UserModel.findById(conversation.targetID);
        conversation.targetName = `${targetUser?.firstName ? targetUser.firstName : ""} ${targetUser?.middleName ? targetUser.middleName : ""} ${targetUser?.lastName ? targetUser.lastName : ""}`;

        return conversation;
      }
    });
    
    // Wait for all promises to resolve
    const allConversationNames = await Promise.all(allConversations);

    return reply.send(allConversationNames);
  } catch (error) {
    return reply.internalServerError(error.message);
  }
};


const insertConversation = async (request, reply, next) => {
  const { adID, initiatorID } = request.body;
  const targetID = request.body.targetID;

  let id;

  try {
    const adExists = await AdModel.exists({
      _id: adID,
    });
    const initiatorExists = await UserModel.exists({
      _id: initiatorID,
    });
    const targetExists = await UserModel.exists({
      _id: targetID,
    });
    const conversationExists = await ConversationModel.exists({
      adID: adID,
      initiatorID: initiatorID,
      targetID: targetID,
    });
    if (adExists == null) {
      throw new Error("ResourceNotFound");
    } else if (initiatorExists == null) {
      throw new Error("ResourceNotFound");
    } else if (targetExists == null) {
      throw new Error("ResourceNotFound");
    } else if (conversationExists !== null) {
      throw new Error("ResourceAlreadyExists");
    } else {
      const count = await ConversationModel.countDocuments({});
      // if (count <= 0) {
      //   id = 1;
      // } else {
      //   const latestRecord = await ConversationModel.findOne().sort({
      //     createdAt: -1,
      //   });
      //   id = Number(latestRecord._id) + 1;
      // }
      const category = await ConversationModel.create({
        _id: new mongoose.mongo.ObjectId(),
        adID: adID,
        createdAt: new Date(),
        initiatorID: initiatorID,
        targetID: targetID,
      });
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
            const latestRecord = await ConversationModel.findOne().sort({
            createdAt: -1,
            });
            id = Number(latestRecord._id) + 1;
        }
        const category = await ConversationModel.create({
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
      return reply.send("Success!");
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
    }
  }
};

const updateConversation = async (request, reply, next) => {
  const { adID, initiatorID } = request.body;
  const messageThread = request.body.messageThread;
  const targetID = request.body.targetID;
  // const imagePath = request.body.imagePath;
  const id = request.params.id;
  try {
    const updatedCategory = await ConversationModel.updateOne(
      {
        _id: id,
      },
      {
        adID: adID,
        initiatorID: initiatorID,
        targetID: targetID,
        messageThread: messageThread,
        updatedAt: new Date(),
      }
    );
    if (updatedCategory.matchedCount == 0) {
      throw new Error("ResourceNotFound");
    } else if (updatedCategory.modifiedCount == 0) {
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

async function deleteConversation(request, reply, next) {
  const id = request.params.id;
  try {
    const deletedCategory = await ConversationModel.deleteOne({
      _id: id,
    });
    if (deletedCategory.deletedCount == 0) {
      throw new Error("ResourceNotFound");
    } else {
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "AssignedToPlatform") {
      return reply.forbidden(
        "Cannot Deleted Category As It Has Platforms Assigned To It."
      );
    } else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
}

module.exports = {
  archiveConversation,
  findConversation,
  findConversationsForAdsByInitiatorAndTarget,
  findConversationsByUser,
  findConversations,
  insertConversation,
  retrieveImage,
  updateConversation,
  uploadImages,
  deleteConversation,
};
