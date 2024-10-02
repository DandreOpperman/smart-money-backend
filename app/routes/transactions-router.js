const transactionsRouter = require("express").Router({ mergeParams: true });
const {
  getTransactions,
  deleteTransaction,
  deleteAllTransactions,
  postTransaction,
  patchTransaction,
} = require("../controllers/transactions-controller");

transactionsRouter.get("/", getTransactions);
transactionsRouter.delete("/", deleteAllTransactions);
transactionsRouter.post("/", postTransaction);
transactionsRouter.patch("/:transaction_id", patchTransaction);
transactionsRouter.delete("/:transaction_id", deleteTransaction);

module.exports = transactionsRouter;
