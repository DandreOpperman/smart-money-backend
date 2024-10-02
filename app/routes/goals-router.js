const goalsRouter = require("express").Router({ mergeParams: true });
const { getGoals } = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);

module.exports = goalsRouter;
