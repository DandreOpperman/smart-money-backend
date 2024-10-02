const { selectExpenses } = require("../models/expenses-model");

exports.getExpenses = (req, res, next) => {
  const { user_id } = req.params;
  selectExpenses(user_id)
    .then((expenses) => {
      console.log(expenses);
      res.status(200).send({ expenses });
    })
    .catch((err) => next(err));
};
