const deleteUser = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    body: {},
    response: {
      200: {
        type: "object",
        properties: {
          response: { type: "string" },
          token: { type: "string" },
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

const findUser = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    body: {},
    response: {
      200: {
        type: "array",
        items: {
          type: 'object',
          required: ["_id", 'contactNumber', "conversations", 'createdAt', "emailAddress", 'firstName', "isActive", 'lastName', "middleName", 'permanentAddress', "sex", 'shippingAddress'],
          properties: {
            _id: {
              type: 'string',
            },
            contactNumber: {
              type: "string",
            },
            conversations: {
              type: "array",
            },
            createdAt: {
              type: "string",
            },
            emailAddress: {
              type: "string",
            },
            firstName: {
              type: "string",
            },
            isActive: {
              type: "boolean",
            },
            lastName: {
              type: "string",
            },
            middleName: {
              type: "string",
            },
            permanentAddress: {
              type: "string",
            },
            sex: {
              type: "string",
            },
            shippingAddress: {
              type: "string",
            }
          }
        },
        // properties: {
          // response: { type: "string" },
          // token: { type: "string" },
        // },
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

const findUsers = {
  schema: {
    // params: {
      // type: "object",
      // required: ["id"],
      // properties: {
      //   id: { type: "string", minLength: 1 },
      // },
    // },
    // body: {},
    response: {
      200: {
        type: "array",
        items: {
          type: 'object',
          required: ["_id", 'contactNumber', "conversations", 'createdAt', "emailAddress", 'firstName', "isActive", 'lastName', 'permanentAddress', "sex", 'shippingAddress'],
          properties: {
            _id: {
              type: 'string',
            },
            contactNumber: {
              type: "string",
            },
            conversations: {
              type: "array",
            },
            createdAt: {
              type: "string",
            },
            emailAddress: {
              type: "string",
            },
            firstName: {
              type: "string",
            },
            isActive: {
              type: "boolean",
            },
            lastName: {
              type: "string",
            },
            middleName: {
              type: "string",
            },
            permanentAddress: {
              type: "string",
            },
            sex: {
              type: "string",
            },
            shippingAddress: {
              type: "string",
            }
          }
        },
        // properties: {
          // response: { type: "string" },
          // token: { type: "string" },
        // },
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

const signin = {
  schema: {
    params: {},
    body: {
      type: "object",
      required: ["emailAddress", "password"],
      properties: {
        emailAddress: { type: "string", minLength: 1 },
        password: { type: "string", minLength: 1 },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          response: { type: "string" },
          token: { type: "string" },
          id: {type: 'string'}
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

const signup = {
  schema: {
    params: {},
    body: {
      type: "object",
      required: ["confirmPassword","contactNumber","dateOfBirth", "emailAddress","firstName","lastName", "middleName", "password","permanentAddress","sex","shippingAddress"],
      properties: {
        confirmPassword: { type: "string", minLength: 1 },
        contactNumber: { type: "string", minLength: 1 },
        dateOfBirth: { type: "date" },
        firstName: { type: "string", minLength: 1 },
        lastName: { type: "string", minLength: 1 },
        middleName: { type: "string", minLength: 1 },
        password: { type: "string", minLength: 1 },
        permanentAddress: { type: "string", minLength: 1 },
        sex: { type: "string", minLength: 1 },
        shippingAddress: { type: "string", minLength: 1 },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          response: { type: "string" },
          token: { type: "string" },
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
  deleteUser,
  findUsers,
  signin,
  signup
};
