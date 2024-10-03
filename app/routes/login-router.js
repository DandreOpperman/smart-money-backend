const loginRouter = require("express").Router();
const { login } = require("../controllers/login-controller");

loginRouter.post("/", login);

module.exports = loginRouter;
