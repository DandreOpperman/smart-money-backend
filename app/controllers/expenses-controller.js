const {
  selectExpenses,
  insertExpense,
  updateExpense,
  removeExpense,
} = require("../models/expenses-model");

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
exports.patchExpenses = (req, res, next) => {
  const patchBody = req.body;
  const { monthly_expenses_id } = req.params;
  updateExpense(monthly_expenses_id, patchBody)
    .then((expense) => {
      res.status(201).send({ expense });
    })
    .catch((err) => next(err));
};
exports.deleteExpense = (req, res, next) => {
  const { monthly_expenses_id } = req.params;
  removeExpense(monthly_expenses_id)
    .then((expense) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
