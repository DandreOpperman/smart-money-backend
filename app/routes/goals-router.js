const goalsRouter = require("express").Router({ mergeParams: true });
const {
  getGoals,
  postGoal,
  deleteAllGoals,
  deleteGoal,
  patchGoal,
} = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);
goalsRouter.post("/", postGoal);
goalsRouter.delete("/", deleteAllGoals);
goalsRouter.delete("/:goal_id", deleteGoal);
goalsRouter.patch("/:goal_id",patchGoal);
module.exports = goalsRouter;
