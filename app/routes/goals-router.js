const goalsRouter = require("express").Router({ mergeParams: true });
const {
  getGoals,
  postGoal,
  deleteAllGoals,
  deleteGoal,
  patchGoal,
  getGoal,
} = require("../controllers/goals-controller");

goalsRouter.get("/", getGoals);
goalsRouter.post("/", postGoal);
goalsRouter.delete("/", deleteAllGoals);
goalsRouter.delete("/:goal_id", deleteGoal);
goalsRouter.patch("/:goal_id",patchGoal);
goalsRouter.get("/:goal_id",getGoal);
module.exports = goalsRouter;
