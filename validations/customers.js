const findCustomer = {
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
  
  const findCustomers = {
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

  const updateCustomer = {
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
            required: ["cartID", 'contactNumber', "emailAddress", 'firstName', "lastName", "middleName", "password", "permanentAddress", "sex", 'shippingAddress'],
            properties: {
              cartID: { type: "number" },
              contactNumber: { type: "number" },
              emailAddress: { type: "string", minLength: 1 },
              firstName: { type: "string" },
              middleName: { type: "string"},
              password: {type: 'string'},
              permanentAddress: { type: 'string' },
              sex: { type: "string" },
              shippingAddress: { type: 'string' }
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
  
  const deleteCustomer = {
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
    findCustomer,
    findCustomers,
    updateCustomer,
    deleteCustomer
  };
  