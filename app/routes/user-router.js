const userRouter = require("express").Router();
const { getUser } = require("../controllers/user-controller");

userRouter.get("/:user_id", getUser);

module.exports = userRouter;
