const { selectGoals } = require("../models/goals-model");

exports.getGoals = (req, res, next) => {
  const { user_id } = req.params;
  selectGoals(user_id)
    .then((goals) => {
      res.status(200).send({ goals });
    })
    .catch((err) => next(err));
};
