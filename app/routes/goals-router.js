const goalsRouter = require("express").Router({ mergeParams: true });
const { getGoals, postGoal } = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);
goalsRouter.post("/", postGoal);

module.exports = goalsRouter;
