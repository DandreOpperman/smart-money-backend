const goalsRouter = require("express").Router({ mergeParams: true });
const {
  getGoals,
  postGoal,
  deleteAllGoals,
  deleteGoal,
} = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);
goalsRouter.post("/", postGoal);
goalsRouter.delete("/", deleteAllGoals);
goalsRouter.delete("/:goal_id", deleteGoal);

module.exports = goalsRouter;
