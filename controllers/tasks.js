"use strict";

// const bcrypt = require("bcryptjs");
const TaskModel = require("../models/tasks.js");
const SegmentModel = require("../models/segments.js");
const fs = require("fs");
const { join } = require("path");

const mv = require("mv");
const util = require("util");
const mvPromisified = util.promisify(mv);

const findTask = async function (request, reply, next) {
  const id = request.params.id;
  try {
    const task = await TaskModel.findOne({
      _id: id,
    }).populate('segment');
    if (task && (task.length !== 0 || task !== null || task !== undefined)) {
      return reply.send(task);
    } else {
      throw new Error("ResourceNotFound");
    };
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.badRequest(error.message);
    };
  };
};

// const findTasks = async (request, reply, next) => {
//   try {
//     const categories = await CategoryModel.find({});
//     if (categories && categories.length > 0) {
//       return reply.send(categories);
//     } else {
//       throw new Error("ResourceNotFound");
//     };
//   } catch (error) {
//     return reply.notFound("The Requested Resources Do Not Exist!");
//   }
// };


const findTasks = async (request, reply, next) => {
  try {
    const { limit = 10, cursor, direction = 'next' } = request.query;

    let query = {};
    let sortOrder = 1;

    // Determine if we're paginating forwards or backwards
    if (cursor) {
      if (direction === 'next') {
        query = { _id: { $gt: cursor } };
        sortOrder = 1; // Ascending for next page
      } else if (direction === 'previous') {
        query = { _id: { $lt: cursor } };
        sortOrder = -1; // Descending for previous page
      }
    }

    // Fetch data with limit + 1 to check if there are more results
    let tasks = await TaskModel.find(query).limit(parseInt(limit) + 1).sort({ _id: sortOrder });

    // Reverse the result if fetching the previous page
    if (direction === 'previous') {
      tasks = tasks.reverse();
    }

    // Extract the actual data for the current page
    const result = tasks.slice(0, parseInt(limit));

    // Check if there's more data
    const hasMore = tasks.length > parseInt(limit);

    // Extract the cursors for the next and previous pages
    const nextCursor = hasMore ? tasks[tasks.length - 1]._id : null;
    const prevCursor = result.length > 0 ? result[0]._id : null;

    if (result && result.length > 0) {
      return reply.send({
        data: result,
        pageInfo: {
          hasNextPage: direction === 'next' ? hasMore : !!cursor,
          hasPreviousPage: direction === 'previous' ? hasMore : !!cursor,
          nextCursor,
          prevCursor,
        },
      });
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    if (error.message === "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.badRequest(error.message);
    }
  }
};


const insertTask = async (request, reply, next) => {
  const { currentStatus, description, editors, expectedReleaseDate, guests, hosts, isEdited, isShot } = request.body;
  const isUploaded = request.body.isUploaded;
  const remarks = request.body.remarks;
  const researchLinks = request.body.researchLinks;
  const segment = request.body.segment;
  const title = request.body.title;

  // let id;
  // let upperCaseTagsArray = [];
  try {
    // const segmentExists = await SegmentModel.findById(segment);

    // if (segmentExists == null || undefined) {
    //   throw new Error("ResourceNotFound");
    // }
    // else {
      const category = await TaskModel.create({
        createdAt: new Date(),
        currentStatus: currentStatus,
        description: description,
        editors: editors,
        expectedReleaseDate: expectedReleaseDate,
        guests: guests,
        hosts: hosts,
        isEdited: isEdited,
        isShot: isShot,
        isUploaded: isUploaded,
        remarks: remarks,
        researchLinks: researchLinks,
        segment: segment,
        title: title
      });
      return reply.send("Success!");
    // };
    // await tags.forEach(element => {
    //   upperCaseTagsArray.push(element.toUpperCase());
    // });
    // const count = await CategoryModel.countDocuments({});
    // if (count <= 0) {
    //   id = 1;
    // } else {
    //   const latestRecord = await CategoryModel.findOne().sort({
    //     createdAt: -1,
    //   });
    //   id = Number(latestRecord._id) + 1;
    // };
  } catch (error) {
    console.log('error: ', error)
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    }
    else {
      return reply.badRequest(error.message);
    };
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
    };
  };
};

const updateTask = async (request, reply, next) => {
  const { currentStatus, description, editors, expectedReleaseDate, guests, hosts, isEdited, isShot } = request.body;
  const isUploaded = request.body.isUploaded;
  const remarks = request.body.remarks;
  const researchLinks = request.body.researchLinks;
  const segment = request.body.segment;
  const title = request.body.title;
  // const imagePath = request.body.imagePath;
  const id = request.params.id;
  try {
    const categoryExists = await CategoryModel.exists({
      _id: id,
    });
    if (categoryExists == null) {
      throw new Error("ResourceNotFound");
    } else {
      const updatedCategory = await CategoryModel.updateOne(
        {
          _id: id,
        },
        {
          currentStatus: currentStatus,
          description: description,
          editors: editors,
          expectedReleaseDate: expectedReleaseDate,
          guests: guests,
          hosts: hosts,
          isEdited: isEdited,
          isShot: isShot,
          isUploaded: isUploaded,
          remarks: remarks,
          researchLinks: researchLinks,
          segment: segment,
          title: title,
          updatedAt: new Date()
        }
      );
      return reply.send("Success!");
    }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    };
  };
};

// async function deleteTask(request, reply, next) {
//   const id = request.params.id;
//   try {
//     const assignedToPlatform = await PlatformModel.find({
//       categoryID: id,
//     });
//     if (assignedToPlatform && assignedToPlatform.length > 0) {
//       throw new Error("AssignedToPlatform");
//     } else {
//       const deletedCategory = await CategoryModel.deleteOne({
//         _id: id,
//       });
//       if (deletedCategory.deletedCount == 0) {
//         throw new Error("ResourceNotFound");
//       } else {
//         return reply.send("Success!");
//       };
//     };
//   } catch (error) {
//     if (error.message == "AssignedToPlatform") {
//       return reply.forbidden(
//         "Cannot Deleted Category As It Has Platforms Assigned To It!"
//       );
//     } else if (error.message == "ResourceNotFound") {
//       return reply.notFound("The Requested Resource Does Not Exist!");
//     } else {
//       return reply.internalServerError(error.message);
//     }
//   }
// }

module.exports = {
  findTask,
  findTasks,
  insertTask,
  retrieveImage,
  updateTask,
  uploadImages,
  // deleteTask,
};
