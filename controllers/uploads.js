const { join } = require('path');

const mv = require('mv');
const util = require('util');
const mvPromisified = util.promisify(mv);

const retrieveImage = async (request, reply, next) => {
  const imageName = request.params.imageName;
  try {
      return reply.sendFile(imageName);
    }
    catch (error) {
        if (error.message == 'ResourceNotFound') {
            return reply.notFound("The Requested Resources Do Not Exist!");
        }
        else {
            return reply.badRequest(error.message);
        };
    };
};

const uploadImages = async (request, reply, next) => {
    const files = Object.entries(request.raw.files);
    // console.log('here', files)
  try {
    // console.log((files))
  /*
  Only Allow Image File Uploads If The Request Is Multipart Type. Otherwise, Data Is Inserted Without Uploading Image File.
  */
  // if (request[kIsMultipartParsed] || request[kIsMultipart] === true) {
    files.forEach(async function (element) {
        console.log('element', element);
        const destination = join(__dirname,`../uploads/${element[1].name}`);
        const writeFile = await mvPromisified(element[1].tempFilePath, destination, {
            mkdirp: true,
        });
    });
        
        return reply.send("Success!");

  }
  catch (error) {
          return reply.internalServerError(error.message);
      next();
  }
};

module.exports = {
    retrieveImage,
    uploadImages
}