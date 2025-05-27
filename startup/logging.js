require("express-async-errors");
const winston = require("winston");
const debug = require("debug")("app:main");

module.exports = function () {
  process.on("uncaughtException", (ex) => {
    debug("Uncaught Exception:", ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    debug("Unhandled Rejection:", ex);
    winston.error(ex.message, ex);
    process.exit(1);
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  if (process.env.NODE_ENV !== "production") {
    winston.add(
      new winston.transports.Console({ format: winston.format.simple() })
    );
  }
};
