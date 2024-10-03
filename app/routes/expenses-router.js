const expensesRouter = require("express").Router({ mergeParams: true });
const {
  patchExpenses,
  getExpenses,
  postExpenses,
  deleteExpense,
} = require("../controllers/expenses-controller");

expensesRouter.get("/", getExpenses);
expensesRouter.post("/", postExpenses);
expensesRouter.patch("/:monthly_expenses_id", patchExpenses);
expensesRouter.delete("/:monthly_expenses_id", deleteExpense);

module.exports = expensesRouter;
