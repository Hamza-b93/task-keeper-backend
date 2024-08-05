const getCart = {
  schema: {
    params: {
      type: "object",
      required: ["customerID"],
      properties: {
        customerID: { type: "string", minLength: 1 },
      },
    },
    response: {
        200: {
            type: "object",
            properties: {
              _id: { type: 'string' },
              products: { type: "array" },
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
  removeFromCart,
};

const addToCart = {
  schema: {
    params: {
      type: "object",
      required: ["cartID"],
      properties: {
        cartID: { type: "string", minLength: 1 },
      },
    },
    body: {
      type: "object",
      required: ["productID", 'quantity'],
      properties: {
        productID: { type: "string", minLength: 1 },
        quantity: {type: 'integer'}
      },
    },
    response: {
        200: {
            type: "object",
            properties: {
              _id: { type: 'string' },
              products: { type: "array" },
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

const removeFromCart = {
  schema: {
    params: {
      type: "object",
      required: ["cartID"],
      properties: {
        cartID: { type: "string", minLength: 1 },
      },
    },
    body: {
      type: "object",
      required: ["productID"],
      properties: {
        productID: { type: "string", minLength: 1 },
      },
    },
    response: {
        200: {
            type: "object",
            properties: {
              _id: { type: 'string' },
              products: { type: "array" },
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
  addToCart,
  getCart,
  removeFromCart
};
