const loginRouter = require("express").Router();
const { getUserID, login } = require("../controllers/login-controller");

loginRouter.get("/:email", getUserID);
loginRouter.post("/", login);

module.exports = loginRouter;
