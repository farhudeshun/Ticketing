const swaggerAutogen = require("swagger-autogen")();
const dotenv = require("dotenv");
dotenv.config();

const outputFile = "./swagger-output.json";
const routes = ["./src/routes/index.js"]; // adjust this if needed

const doc = {
  info: {
    title: "Ticketing API",
    description: "API documentation for the Ticketing system",
  },
  host: process.env.BASE_URL.replace(/^https?:\/\//, "") || "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
    },
  },
  tags: [
    { name: "Auth", description: "Authentication routes" },
    { name: "Admin", description: "Admin dashboard and operations" },
    { name: "User", description: "Authenticated user endpoints" },
    { name: "Users", description: "User management" },
    { name: "Tickets", description: "Ticket management and admin operations" },
  ],
};

swaggerAutogen(outputFile, routes, doc);
