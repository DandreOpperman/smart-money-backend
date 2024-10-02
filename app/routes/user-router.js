const userRouter = require("express").Router();
const transactionsRouter = require("./transactions-router");
const goalsRouter = require("./goals-router");
const {
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require("../controllers/user-controller");
const { getExpenses } = require("../controllers/expenses-controller");

userRouter.use("/:user_id/transactions", transactionsRouter);
userRouter.use("/:user_id/goals", goalsRouter);

userRouter.post("/", postUser);
userRouter.patch("/:user_id", patchUser);
userRouter.delete("/:user_id", deleteUser);
userRouter.get("/:user_id", getUser);
userRouter.get("/:user_id/expenses", getExpenses);

module.exports = userRouter;
