const {
  selectGoals,
  insertGoal,
  removeAllGoals,
  removeGoal,
} = require("../models/goals-model");

exports.getGoals = (req, res, next) => {
  const { user_id } = req.params;
  selectGoals(user_id)
    .then((goals) => {
      res.status(200).send({ goals });
    })
    .catch((err) => next(err));
};

exports.postGoal = (req, res, next) => {
  const { user_id } = req.params;
  const requestBody = req.body;
  insertGoal(requestBody, user_id)
    .then((goal) => {
      res.status(201).send({ goal });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteAllGoals = (req, res, next) => {
  const { user_id } = req.params;
  removeAllGoals(user_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

exports.deleteGoal = (req, res, next) => {
  const { user_id, goal_id } = req.params;
  removeGoal(user_id, goal_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};
