const findMessage = {
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
        type: "object",
        required: ['_id', "conversationID", 'createdAt', "receiverID", 'text', "senderID", '__v'],
        properties: {
          _id: { type: "string" },
          conversationID: { type: "string" },
          createdAt: { type: "string" },
          receiverID: { type: "string" },
          text: { type: "string" },
          senderID: { type: "string" },
          __v: { type: "string" }
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

const findMessages = {
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
        required: ['_id', "conversationID", 'createdAt', "receiverID", 'text', "senderID", '__v'],
        properties: {
          _id: { type: "string" },
          conversationID: { type: "string" },
          createdAt: { type: "string" },
          receiverID: { type: "string" },
          text: { type: "string" },
          senderID: { type: "string" },
          __v: { type: "string" }
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

const insertMessage = {
  schema: {
    params: {
      type: "object",
      required: [],
      properties: {},
    },
    body: {
      type: "object",
      required: ["conversationID", "receiverID", "text", "senderID"],
      properties: {
        conversationID: { type: "string" },
        receiverID: { type: "string" },
        senderID: { type: "string" },
        text: { type: "string" },
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

const updateMessage = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    required: ["conversationID", "receiverID", "text", "senderID"],
    properties: {
      conversationID: { type: "string" },
      receiverID: { type: "string" },
      senderID: { type: "string" },
      text: { type: "string" },
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

const deleteMessage = {
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
  findMessage,
  findMessages,
  insertMessage,
  updateMessage,
  deleteMessage,
};
