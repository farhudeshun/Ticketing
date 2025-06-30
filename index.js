require("dotenv").config();
const express = require("express");
const app = express();
const config = require("config");
const router = require("./src/routes/");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swaggerConfig");

mongoose.set("debug", (coll, method, query) => {
  console.log(`Mongoose ${method} on ${coll}: ${JSON.stringify(query)}`);
});

mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Enhanced Swagger UI setup
const swaggerOptions = {
  explorer: true, // Enable the explorer bar
  swaggerOptions: {
    persistAuthorization: true, // This will persist the authorization token across page refreshes
    authAction: {
      // This makes the Authorize button more prominent
      bearerAuth: {
        name: "bearerAuth",
        schema: {
          type: "http",
          in: "header",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        value: "Bearer <your-token-here>", // Default value (optional)
      },
    },
  },
};

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerOptions));

app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📄 Swagger docs available at http://localhost:${port}/doc`);
  console.log(
    `📧 Email test endpoint available at http://localhost:${port}/test-email`
  );
});
