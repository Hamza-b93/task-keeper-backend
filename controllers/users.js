"use strict";

// const bcrypt = require("bcryptjs");
// const AdModel = require("../models/ads.js");
const UserModel = require("../models/users.js");
const nodemailer = require("nodemailer");

const config = require("../config.js");
const jwt = require("jsonwebtoken");

// Add Cart Model Here.

const { join } = require("path");

const fs = require("fs");
const mv = require("mv");
const util = require("util");
const mvPromisified = util.promisify(mv);
const unlinkAsync = util.promisify(fs.unlink);

const crypto = require("crypto");
const fastify = require("fastify");
let base32 = require('base32');

const transporter = nodemailer.createTransport({
  // service: "Yandex",
  // auth: {
  //   user: "hamzab93@yandex.com",
  //   pass: "ubnjikmxlscsedrn",
  // },
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'glen55@ethereal.email',
    pass: 'CTfCXXWSfQmXzTW9y5'
  }
});

// let randomBytes = crypto.randomBytes(32);
// console.log(randomBytes);
// let OTPSecret = base32.encode(randomBytes, 'Crockford', { padding: false });
// console.log("OTP SECRET: ", OTPSecret);
// console.log("OTP SECRET DECODE: ", base32.decode(OTPSecret));

const findUser = async function (request, reply, next) {
  const id = request.params.id;
  const authHeader = request.headers['authorization'];
  // if (authHeader || authHeader !== null || authHeader !== undefined) {
  //   const token = authHeader.split(' ')[1];
  //   const validateToken = await jwt.verify(
  //     token,
  //     config.JWT_SECRET,
  //     config.TEMPORARY_JWT_OPTIONS
  //   );
  // }
  // else {
  //   throw new Error('authorizationError');
  // }
  try {
    // const validateToken = await jwt.verify(
    //   token,
    //   config.JWT_SECRET,
    //   config.TEMPORARY_JWT_OPTIONS
    // );
    const user = await UserModel.findOne({
      _id: id,
    });
    if (user && user !== undefined || user !== null) {
      return reply.send(user);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    if (error.message == "authorizationError") {
      return reply.forbidden("You Do Not Have Permission To Access This Resource!");
    }
    else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      console.log('error: ', error)
      return reply.badRequest(error.message);
    }
  }
};

const findUsers = async (request, reply, next) => {
  try {
    const users = await UserModel.find({});
    if (users && (users != null || users != undefined || users.length > 0)) {
      return reply.send(users);
    } else {
      throw new Error("ResourceNotFound");
    }
  } catch (error) {
    return reply.notFound("The Requested Resources Do Not Exist!");
  }
};

const signup = async (request, reply, next) => {
  /*
    Required Fields:
        - ProductID.
        - Product Name.
        - Article No.
        - Details.
        - Image.
  */
  const {
    confirmPassword,
    contactNumber,
    dateOfBirth,
    emailAddress,
    firstName,
    lastName,
    middleName,
  } = request.body;
  const password = request.body.password;
  const permanentAddress = request.body.permanentAddress;
  const sex = request.body.sex;
  const shippingAddress = request.body.shippingAddress;

  const files = request.raw.files;

  const maxFileCount = 1;

  let recordCount;
  let verificationToken;

  try {
    const emailExists = await UserModel.exists({
      emailAddress: emailAddress,
    });

    if (password !== confirmPassword) {
      throw new Error("PasswordMismatch");
    }
    else if (emailExists !== null) {
      throw new Error("EmailExists");
    }
    else if (!files || Object.keys(files).length === 0) {
      throw new Error("NoFilesUploaded");
    }
    else if (Object.keys(files).length > maxFileCount) {
      throw new Error("FileLimitExceeded");
    }
    else if (files.size > 5 * 1024 * 1024) {
      // Delete the temporary file before throwing an error
      await unlinkAsync(files.tempFilePath);
      throw new Error("FileSizeExceeded");
    }
    else {
      // Email Settings Go Here.

      /*
      const mailOptions = {
        from: "glen55@ethereal.email",
        to: 'hamza.b93@protonmail.com',
        subject: "Sending Email using Node.js",
        text: `This email outlines the result that is produced after using ndoemailer to send email using yan email service. Your One Time OTP Is:`,
      };
      const sendMail = transporter.sendMail(mailOptions, async function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('infoo: ', info)
          console.log("Email sent: " + info.response);
        }
      });
      console.log('sendMail: ', sendMail)
      */
      // const count = await UserModel.countDocuments({});
      // if (count <= 0) {
      //   recordCount = 1;
      // } else {
      //   const latestRecord = await UserModel.findOne().sort({
      //     createdAt: -1,
      //   });
      //   recordCount = Number(latestRecord.count) + 1;
      // }

      // Move files to the uploads directory
      const uploads = [];
      const processedFiles = {}; // To track processed files

      // for (const fileKey of Object.keys(files)) {
      //   const file = files[fileKey];
      //   console.log('temp path: ', file.tempFilePath)
      //   // Check if the file has already been processed
      //   if (processedFiles[file.name]) {
      //     continue; // Skip processing this file
      //   }

      //   processedFiles[file.name] = true; // Mark file as processed
      //   const destination = join(__dirname, `../uploads/${file.name}`);
      //   await mvPromisified(file.tempFilePath, destination);
      //   uploads.push(destination);
      // };

      const fileKey = Object.keys(files)[0]; // Get the first (and only) file key
      const file = files[fileKey];

      console.log('temp path: ', file.tempFilePath);

      // Check if the file has already been processed
      if (processedFiles[file.name]) {
        throw new Error("FileAlreadyProcessed");
      }

      processedFiles[file.name] = true; // Mark file as processed
      const destination = join(__dirname, `../uploads/${file.name}`);
      await mvPromisified(file.tempFilePath, destination);
      uploads.push(destination);

      const salt = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await crypto
        .scryptSync(password, salt, 64)
        .toString(`hex`);

      // verificationToken = Math.floor(
      //   Math.random() * (999999999 - 100000000) + 100000000
      // );

      const user = await UserModel.create({
        contactNumber: contactNumber,
        // count: recordCount,
        createdAt: new Date(),
        dateOfBirth: dateOfBirth,
        emailAddress: emailAddress,
        firstName: firstName,
        imagePath: destination,
        isActive: true,
        lastName: lastName,
        middleName: middleName,
        password: hashedPassword,
        permanentAddress: permanentAddress,
        salt: salt,
        sex: sex,
        shippingAddress: shippingAddress,
        userType: "CONSUMER",
        //   verificationToken: verificationToken,
      });

      const userObj = {
        _id: user._id,
        // count: recordCount,
        emailAddress: emailAddress,
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
      };

      const permanentJWT = jwt.sign(
        { userObj },
        config.JWT_SECRET,
        config.PERMANENT_JWT_OPTIONS
      );

      const validateToken = jwt.verify(
        permanentJWT,
        config.JWT_SECRET,
        config.PERMANENT_JWT_VALIDATION_CONFIG_OPTIONS
      );

      // let OTPSecret = await crypto.randomBytes(32).toString('base32');
      // console.log("OTP SECRET: ", OTPSecret);

      let min = Math.pow(10, 6 - 1);
      let max = Math.pow(10, 6) - 1;
      let emailVerificationCode = Math.floor(Math.random() * (max - min + 1)) + min;

      if (validateToken.userObj) {
        const updatePermanentJWT = await UserModel.updateOne({
          _id: user._id
        },
        {
          permanentJWT: permanentJWT,
        })
        return reply.send("Success!");
      } else {
        throw new Error("JsonWebTokenError");
      }
    }
  }
  catch (error) {
    console.log(error)
    // Delete temporary files in case of an error
    if (error.message == "EmailExists") {
      console.log('here')
      return reply.badRequest("A User With This Email Already Exists!");
    }
    if (files) {
      for (const fileKey of Object.keys(files)) {
        const file = files[fileKey];
        if (file.tempFilePath) {
          // Check if the file exists before attempting to unlink it
          if (fs.existsSync(file.tempFilePath)) {
            await unlinkAsync(file.tempFilePath);
          }
        }
      }
    }
    else if (error instanceof jwt.JsonWebTokenError) {
      return reply.unauthorized("Invalid Data In Token!");
    } else if (error instanceof jwt.NotBeforeError) {
      return reply.unauthorized("Token Not Yet Active!");
    } else if (error instanceof jwt.TokenExpiredError) {
      return reply.unauthorized("Token expired!");
    }
    else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    }
    else if (error.message === "NoFilesUploaded") {
      return reply.badRequest("No Files Were Uploaded!");
    } else if (error.message === "FileLimitExceeded") {
      return reply.payloadTooLarge("You Cannot Attach More Than 1 File!");
    } else if (error.message === "FileSizeExceeded") {
      return reply.badRequest("File Size Exceeds The Maximum Limit Of 5 MB For Your File!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
};


const signin = async (request, reply, next) => {
  /*
    Required Fields:
        - ProductID.
        - Product Name.
        - Article No.
        - Details.
        - Image.
    */
  const password = request.body.password;
  const emailAddress = request.body.emailAddress;

  let id;

  try {
    const emailExists = await UserModel.exists({
      emailAddress: emailAddress,
    });
    if (emailExists == null) {
      throw new Error("ResourceNotFound");
    } else {
      const count = await UserModel.countDocuments({});
      if (count <= 0) {
        id = 1;
      } else {
        const latestRecord = await UserModel.findOne().sort({
          createdAt: -1,
        });
        id = Number(latestRecord._id) + 1;
      }

      const user = await UserModel.findOne({
        emailAddress: emailAddress,
      });
      const salt = user.salt;
      const hashedPassword = crypto
        .scryptSync(password, salt, 64)
        .toString(`hex`);
      if (user.password === hashedPassword) {
        const userObj = {
          id: user._id,
          emailAddress: user.emailAddress,
        };
        const token = jwt.sign(
          { userObj },
          config.JWT_SECRET,
          config.TEMPORARY_JWT_OPTIONS
        );
        const validatePermanentToken = jwt.verify(
          user.permanentJWT,
          config.JWT_SECRET,
          config.PERMANENT_JWT_VALIDATION_CONFIG_OPTIONS
        );
        console.log('permanent: ', validatePermanentToken)
        const validateToken = jwt.verify(
          token,
          config.JWT_SECRET,
          config.TEMPORARY_JWT_OPTIONS
        );
        console.log('here: ', typeof(validatePermanentToken.userObj.emailAddress))
        if (validateToken && (validatePermanentToken.userObj._id == user._id && validatePermanentToken.userObj.emailAddress === user.emailAddress)) {
          return reply.send({ response: "Success!", token: token, id: user._id });
        }
        else {
          throw new Error("InvalidCredentials");
        };
      } else {
        throw new Error("InvalidCredentials");
      }
    }
  } catch (error) {
    if (error.message == "EmailAlreadyExists") {
      return reply.notFound("A User With This Email Already Exists!");
    } else if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resources Do Not Exist!");
    } else if (error.message == "InvalidCredentials") {
      return reply.forbidden(
        "Incorrect Email And/Or Password! Please Try Again!"
      );
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
    }
  }
};

const updateUser = async (request, reply, next) => {
  const { contactNumber, emailAddress, firstName, imagePath, lastName } =
    request.body;
  const middleName = request.body.middleName;
  const password = request.body.password;
  const permanentAddress = request.body.permanentAddress;
  const sex = request.body.sex;
  const shippingAddress = request.body.shippingAddress;

  const id = request.params.id;
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
    else if (validateToken.iss && String(id) !== validateToken.userObj.id) {
      throw new Error("InvalidToken");
    }
    else {
      const updatedUser = await UserModel.updateOne(
        { _id: id },
        {
          contactNumber: contactNumber,
          emailAddress: emailAddress,
          firstName: firstName,
          imagePath: imagePath,
          lastName: lastName,
          middleName: middleName,
          password: password,
          permanentAddress: permanentAddress,
          sex: sex,
          shippingAddress: shippingAddress,
          updatedAt: new Date(),
        }
      );
      if (updatedUser.matchedCount == 0) {
        throw new Error("ResourceNotFound");
      } else if (updatedUser.modifiedCount == 0) {
        throw new Error("BadRequest");
      }
      else if (error.message == "InvalidTokenSignature") {
        return reply.unauthorized("Token Signature Invalid!");
      }
      else if (error.message == "InvalidToken") {
        return reply.unauthorized("You Are Not Authorized To To Access This Resource!");
      }
      else {
        return reply.send("Success!");
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
    else if (error.message == "BadRequest") {
      return reply.badRequest(
        "Resource Not Updated! Kindly Check That The Values You Input Match Their Respective Validation Rules!"
      );
    } else {
      return reply.internalServerError(error.message);
    }
  }
};

const updateImage = async (request, reply, next) => {
  const files = request.raw.files;
  const maxFileCount = 1;

  const id = request.params.id;

  try {
    /*
  Only Allow Image File Uploads If The Request Is Multipart Type. Otherwise, Data Is Inserted Without Uploading Image File.
  */
    const userExists = await UserModel.exists({
      _id: id,
    });
    if (userExists == null) {
      throw new Error("ResourceNotFound");
    }
    else if (!files || Object.keys(files).length === 0) {
      throw new Error("NoFilesUploaded");
    }
    else if (Object.keys(files).length > maxFileCount) {
      throw new Error("FileLimitExceeded");
    }
    else {
      // Move files to the uploads directory
      const uploads = [];
      for (const fileKey of Object.keys(files)) {
        const file = files[fileKey];
        if (file.size > 5 * 1024 * 1024) {
          // Delete the temporary file before throwing an error
          await unlinkAsync(file.tempFilePath);
          throw new Error("FileSizeExceeded");
        }

        const destination = join(__dirname, `../uploads/${file.name}`);
        await mvPromisified(file.tempFilePath, destination);
        uploads.push(destination);
      }
      const updatedUser = await UserModel.updateOne(
        { _id: id },
        {
          imagePath: uploads,
          updatedAt: new Date(),
        }
      );
    } return reply.send("Success!")
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    }
    else if (error.message === "NoFilesUploaded") {
      return reply.badRequest("No Files Were Uploaded!");
    } else if (error.message === "FileLimitExceeded") {
      return reply.payloadTooLarge("You Cannot Attach More Than 1 File!");
    } else if (error.message === "FileSizeExceeded") {
      return reply.badRequest("File Size Exceeds The Maximum Limit Of 5 MB For Your File!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
};

async function deactivateUser(request, reply, next) {
  const id = request.params.id;
  try {
    // Add Support To Delete User's Cart.
    const deactivatedUser = await UserModel.updateOne(
      { _id: id },
      {
        isActive: false,
      }
    );
    // if ((deactivatedUser.update = 0)) {
    // throw new Error("ResourceNotFound");
    // } else {
    return reply.send("Resource Deleted Successfully!");
    // }
  } catch (error) {
    if (error.message == "ResourceNotFound") {
      return reply.notFound("The Requested Resource Does Not Exist!");
    } else {
      return reply.internalServerError(error.message);
    }
  }
}

// async function deleteUser(request, reply, next) {
//   const id = request.params.id;
//   try {
//     const deletedAds = await AdModel.deleteMany({
//       userID: id,
//     });
//     // Add Support To Delete User's Cart.
//     const deletedUser = await UserModel.deleteOne({
//       _id: id,
//     });
//     if ((deletedUser.deletedCount = 0)) {
//       throw new Error("ResourceNotFound");
//     } else {
//       return reply.send("Resource Deleted Successfully!");
//     }
//   } catch (error) {
//     if (error.message == "ResourceNotFound") {
//       return reply.notFound("The Requested Resource Does Not Exist!");
//     } else {
//       return reply.internalServerError(error.message);
//     }
//   }
// }

const verifyEmail = async (request, reply, next) => {
  /*
    Required Fields:
        - ProductID.
        - Product Name.
        - Article No.
        - Details.
        - Image.
    */
  let storedVerificationToken;
  const verificationToken = request.body.verificationToken;

  try {
    const emailExists = await UserModel.exists({
      emailAddress: emailAddress,
    });
    if (emailExists == null) {
      throw new Error("EmailNotFound");
    } else {
      storedVerificationToken = emailExists.verificationToken;
      if (verificationToken === storedVerificationToken) {
        return reply.send("Success!");
      } else {
        throw new Error("EmailVerificationError");
      }
    }
  } catch (error) {
    if (error.message == "EmailNotFound") {
      return reply.notFound("No User With This Email Exists!");
    } else if (error.message == "EmailVerificationError") {
      return reply.badRequest(
        "The Verification Code You Entered Is Invalid Or Incorrect. Please Try Again."
      );
    } else {
      return reply.internalServerError(error.message);
    }
  }
};

module.exports = {
  findUser,
  findUsers,
  signin,
  signup,
  retrieveImage,
  updateUser,
  updateImage,
  // deleteUser,
};
