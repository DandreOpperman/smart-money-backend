const { selectExpenses, insertExpense } = require("../models/expenses-model");

exports.getExpenses = (req, res, next) => {
  const { user_id } = req.params;
  selectExpenses(user_id)
    .then((expenses) => {
      res.status(200).send({ expenses });
    })
    .catch((err) => next(err));
};
exports.postExpenses = (req, res, next) => {
  const newExpense = req.body;
  const { user_id } = req.params;
  insertExpense(user_id, newExpense)
    .then((expense) => {
      res.status(201).send({ expense });
    })
    .catch((err) => next(err));
};
