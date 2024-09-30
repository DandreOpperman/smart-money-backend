const express = require("express");
const app = express();
const apiRouter = require("./app/routes/api-router");
const cors = require("cors");

// const {
//   psqlErrorHandler,
//   customErrorHandler,
//   serverErrorHandler,
// } = require('./app/errors');

app.use(express.json());
app.use("/api", apiRouter);
// app.use(psqlErrorHandler);
// app.use(customErrorHandler);
// app.use(serverErrorHandler);

module.exports = app;
