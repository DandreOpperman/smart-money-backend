const apiRouter = require("express").Router();
const userRouter = require("./user-router.js");
const loginRouter = require("./login-router.js");
const endpoints = require("../../endpoints.json");

apiRouter.use("/user", userRouter);
apiRouter.use("/login", loginRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints });
});

module.exports = apiRouter;
