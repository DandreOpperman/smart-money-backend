const userRouter = require("express").Router();
const {
  getUser,
  postUser,
  patchUser,
  deleteUser,
} = require("../controllers/user-controller");
const { getExpenses } = require("../controllers/expenses-controller");

userRouter.post("/", postUser);
userRouter.patch("/:user_id", patchUser);
userRouter.delete("/:user_id", deleteUser);
userRouter.get("/:user_id", getUser);
userRouter.get("/:user_id/expenses", getExpenses);

module.exports = userRouter;
