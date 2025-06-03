const swaggerAutogen = require("swagger-autogen")();
const doc = {
  info: {
    title: "Ticketing API",
    description: "API documentation for the Ticketing system",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "Enter your bearer token in the format **Bearer &lt;token>**",
    },
  },
  security: [{ bearerAuth: [] }],
  definitions: {
    // You can add your model schemas here if needed
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/index"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger file generated successfully!");
  // You can start your server here if you want
});
