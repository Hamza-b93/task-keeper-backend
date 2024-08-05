const findProduct = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    response: {
      200: {
        type: "array",
        properties: {
          // success: { type: "string" },
          // categories: {type: 'array'}
        },
      },
      404: {
        type: "object",
        //   header: {
        //     abc: "abc"
        //   },
        properties: {
          statusCode: { type: "integer" },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

const findProducts = {
  schema: {
    /*
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
        password: { type: "string", minLength: 8 },
      },
    },
    */
    response: {
      200: {
        type: "array",
        properties: {
          // success: { type: "string" },
          // categories: {type: 'array'}
        },
      },
      404: {
        type: "object",
        properties: {
          statusCode: { type: "integer" },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

const findProductsBySexAndSubCategory = {
  schema: {
    query: {
      type: "object",
      required: ["sex", 'subCategoryID'],
      properties: {
        sex: { type: "string", minLength: 1, maxLength: 6 },
        subCategoryID: { type: 'string' }
      },
    },
    response: {
      200: {
        type: "array",
        properties: {
          // success: { type: "string" },
          // categories: {type: 'array'}
        },
      },
      404: {
        type: "object",
        //   header: {
        //     abc: "abc"
        //   },
        properties: {
          statusCode: { type: "integer" },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

const updateProducts = {
  schema: {
      params: {
          type: "object",
          required: ["id"],
          properties: {
              id: { type: "string", minLength: 1 },
          },
      },
      body: {
          type: 'object',
          required: ['articleNumber', 'colors', 'details', 'sex', 'imagespath', "keywords", "name", "rank", "seoURL", "size", "subCategoryID"],
          properties: {
            articleNumber: { type: "number" },
            colors: { type: "array" },
            details: { type: "array" },
            sex: { type: "string" },
            imageName: { type: "string", minLength: 1 },
            imagePath: { type: "string", minLength: 1 },
            keywords: { type: "array" },
            name: { type: "string" },
            rank: { type: "number" },
            seoURL: { type: "string" },
            size: { type: "number" },
            subCategoruID: { type: "number" },
          },
      },
  response: {
      200: {
      type: "string",
      //   header: {
      //     abc: "abc"
      //   },
      properties: {
      //   success: { type: "string" },
      },
    },
    404: {
      type: "object",
      //   header: {
      //     abc: "abc"
      //   },
      properties: {
        statusCode: { type: "integer" },
        error: { type: "string" },
        message: { type: "string" },
      },
    },
  },
},
};

const deleteProduct = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    response: {
      200: {
        type: "string",
        //   header: {
        //     abc: "abc"
        //   },
        properties: {
          // success: { type: "string" },
        },
      },
      404: {
        type: "object",
        //   header: {
        //     abc: "abc"
        //   },
        properties: {
          statusCode: { type: "integer" },
          error: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  },
};

module.exports = {
  findProduct,
  findProducts,
  findProductsBySexAndSubCategory,
  updateProducts,
  deleteProduct
};
