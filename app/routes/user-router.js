const userRouter = require("express").Router();
const transactionsRouter = require("./transactions-router");
const {
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require("../controllers/user-controller");
const {
  getExpenses,
  postExpenses,
} = require("../controllers/expenses-controller");

userRouter.use("/:user_id/transactions", transactionsRouter);

userRouter.post("/", postUser);
userRouter.patch("/:user_id", patchUser);
userRouter.delete("/:user_id", deleteUser);
userRouter.get("/:user_id", getUser);
userRouter.get("/:user_id/expenses", getExpenses);
userRouter.post("/:user_id/expenses", postExpenses);

module.exports = userRouter;
