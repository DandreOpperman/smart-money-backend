const loginRouter = require("express").Router();
const { getUserID } = require("../controllers/login-controller");

loginRouter.get("/:email", getUserID);

module.exports = loginRouter;
