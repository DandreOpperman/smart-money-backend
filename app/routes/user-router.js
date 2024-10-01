const userRouter = require("express").Router();
const { getUser, postUser } = require("../controllers/user-controller");

userRouter.post("/", postUser);

userRouter.get("/:user_id", getUser);

module.exports = userRouter;
