require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const BASE_PATH = "/api/v1";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ticketing API",
      version: "1.0.0",
      description: "API documentation for the Ticketing system",
    },
    servers: [
      {
        url: `${BASE_URL}${BASE_PATH}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Enter your JWT Bearer token in the format **Bearer &lt;token&gt;**. Example: Bearer abc123xyz",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/**/*.js", "./src/dto/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
