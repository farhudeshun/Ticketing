const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Ticketing API",
    version: "1.0.0",
    description:
      "This is the official API documentation for the Ticketing system. It provides a comprehensive guide to interacting with the Ticketing backend services.",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your bearer token in the format **Bearer <token>**",
      },
    },

    schemas: {
      User: {
        type: "object",
        properties: {
          _id: {
            type: "string",
            description: "The unique identifier for the user.",
            example: "60c72b2f9b1d8c001f8e4c6d",
          },
          name: { type: "string", example: "John Doe" },
          email: {
            type: "string",
            format: "email",
            example: "john.doe@example.com",
          },
          role: {
            type: "string",
            enum: ["user", "support", "admin"],
            example: "user",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      RegisterUser: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: {
            type: "string",
            format: "email",
            example: "jane.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            minLength: 6,
            example: "password123",
          },
        },
      },
      LoginUser: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "jane.doe@example.com",
          },
          password: {
            type: "string",
            format: "password",
            example: "password123",
          },
        },
      },

      Ticket: {
        type: "object",
        properties: {
          _id: { type: "string", example: "60c72b2f9b1d8c001f8e4c7e" },
          title: { type: "string", example: "Cannot access my account" },
          description: {
            type: "string",
            example: "When I try to log in, I get an error.",
          },
          status: {
            type: "string",
            enum: ["open", "in-progress", "closed"],
            example: "open",
          },
          user: {
            type: "string",
            description: "ID of the user who created the ticket.",
            example: "60c72b2f9b1d8c001f8e4c6d",
          },
          support: {
            type: "string",
            description: "ID of the support staff assigned.",
            example: "60c72b2f9b1d8c001f8e4c6f",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateTicket: {
        type: "object",
        required: ["title", "description"],
        properties: {
          title: { type: "string", example: "API not responding" },
          description: {
            type: "string",
            example: "The /users endpoint is returning a 500 error.",
          },
        },
      },
    },

    responses: {
      Unauthorized: {
        description: "Authentication error. Token is invalid or missing.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Unauthorized" },
              },
            },
          },
        },
      },
      Forbidden: {
        description:
          "Access denied. User does not have sufficient permissions.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: { message: { type: "string", example: "Forbidden" } },
            },
          },
        },
      },
      NotFound: {
        description: "The requested resource was not found.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Resource not found" },
              },
            },
          },
        },
      },
      ValidationError: {
        description: "The request body or parameters are invalid.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Validation Error" },
                errors: { type: "array", items: { type: "object" } },
              },
            },
          },
        },
      },
      InternalServerError: {
        description: "An unexpected error occurred on the server.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Internal Server Error" },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
