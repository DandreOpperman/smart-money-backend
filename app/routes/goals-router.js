const goalsRouter = require("express").Router({ mergeParams: true });
const {
  getGoals,
  postGoal,
  deleteAllGoals,
} = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);
goalsRouter.post("/", postGoal);
goalsRouter.delete("/", deleteAllGoals);

module.exports = goalsRouter;
