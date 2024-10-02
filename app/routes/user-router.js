const userRouter = require("express").Router();
const transactionsRouter = require("./transactions-router");
const {
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require("../controllers/user-controller");

userRouter.use("/:user_id/transactions", transactionsRouter);

userRouter.post("/", postUser);
userRouter.patch("/:user_id", patchUser);
userRouter.delete("/:user_id", deleteUser);
userRouter.get("/:user_id", getUser);

module.exports = userRouter;
