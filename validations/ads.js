const findAd = {
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
        required: ['_id', "categoryID", 'condition', "createdAt", 'deliveryMethod', "description", 'isNegotiable', "isSold", 'paymentMethod', 'platformID', "price", 'quantity', "sellerID", 'tags', "title", '__v'],
        properties: {
          _id: { type: "string" },
          categoryID: { type: "string" },
          condition: { type: "string" },
          createdAt: { type: "string" },
          deliveryMethod: { type: "string" },
          description: { type: "string" },
          imagesPaths: {type: 'array'},
          isNegotiable: { type: "boolean" },
          isSold: { type: "boolean" },
          paymentMethod: { type: "string" },
          platformID: { type: "string" },
          price: { type: "number" },
          quantity: { type: "number" },
          sellerID: { type: "string" },
          tags: { type: 'array' },
          title: { type: "string" },
          __v: { type: 'number' }
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

const findAds = {
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
        type: "object",
        required: ["data", 'cursorArray'],
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              required: ['_id', 'categoryID', 'condition', 'createdAt', 'deliveryMethod', 'description', 'isNegotiable', 'isSold', 'paymentMethod', 'platformID', 'price', 'quantity', 'sellerID', 'tags', 'title', '__v'],
              properties: {
                _id: { type: "string" },
                categoryID: { type: "string" },
                condition: { type: "string" },
                createdAt: { type: "string" },
                deliveryMethod: { type: "string" },
                description: { type: "string" },
                isNegotiable: { type: "boolean" },
                isSold: { type: "boolean" },
                paymentMethod: { type: "string" },
                platformID: { type: "string" },
                price: { type: "number" },
                quantity: { type: "number" },
                sellerID: { type: "string" },
                tags: { type: 'array' },
                title: { type: "string" },
                __v: { type: 'number' }
              },
            },
          },
          cursorArray: {
            type: "array",
            // required: ["hasNextPage", "nextCursor"],
            properties: {},
          },
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

const insertAd = {
  schema: {
    params: {
      type: "object",
      required: [],
      properties: {},
    },
    body: {
      type: "object",
      required: [
        "categoryID",
        'condition',
        'deliveryMethod',
        'description',
        'isNegotiable',
        "isSold",
        'paymentMethod',
        "platformID",
        'price',
        "quantity",
        "sellerID",
        "tags",
        "title",
        "file1",
        'file2',
        'file3',
        'file4',
        'file5',
        'file6',
      ],
      properties: {
        categoryID: { type: "string" },
        condition: { type: "string" },
        deliveryMethod: { type: "string" },
        description: { type: "string" },
        isNegotiable: { type: ["boolean", 'string'] },
        isSold: { type: ["boolean", 'string'] },
        paymentMethod: { type: "string" },
        platformID: { type: "string" },
        price: { type: "number" },
        quantity: { type: "number" },
        sellerID: { type: "string" },
        tags: { type: "array" },
        title: { type: "string" },
        file1: { type: "object" },
        file2: { type: "object" },
        file3: { type: "object" },
        file4: { type: "object" },
        file5: { type: "object" },
        file6: { type: "object" }
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
      400: {
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
      401: {
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
      413: {
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

const updateAd = {
  schema: {
    params: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1 },
      },
    },
    required: [
      'condition',
      'deliveryMethod',
      'description',
      'isNegotiable',
      "isSold",
      'paymentMethod',
      "platformID",
      'price',
      "quantity",
      "sellerID",
      "tags",
      "title"
    ],
    properties: {
      categoryID: { type: "number" },
      condition: { type: "string" },
      deliveryMethod: { type: "string" },
      description: { type: "string" },
      isNegotiable: { type: "boolean" },
      isSold: { type: "boolean" },
      paymentMethod: { type: "string" },
      platformID: { type: "number" },
      price: { type: "number" },
      quantity: { type: "number" },
      sellerID: { type: "number" },
      tags: { type: "array" },
      title: { type: "string" }
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

const deleteAd = {
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
  findAd,
  findAds,
  insertAd,
  updateAd,
  deleteAd
};
