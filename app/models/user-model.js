const db = require("../../db/connection");

exports.selectUser = (user_id) => {
  const queryPromises = [];
  const userPromise = db.query(
    `
    SELECT * FROM users
    WHERE user_id = $1`,
    [user_id]
  );
  queryPromises.push(userPromise);

  const mandatorySpendPromise = db.query(
    `
    SELECT SUM(monthly_expenses.cost)::INT AS mandatory_spend
    FROM users JOIN monthly_expenses 
    ON users.user_id = monthly_expenses.user_id
    WHERE users.user_id = $1`,
    [user_id]
  );
  queryPromises.push(mandatorySpendPromise);

  const disposableSpendPromise = db.query(
    `
    SELECT SUM(transactions.cost)::INT AS disposable_spend
    FROM users JOIN transactions 
    ON users.user_id = transactions.user_id
    WHERE users.user_id = $1`,
    [user_id]
  );
  queryPromises.push(disposableSpendPromise);

  return Promise.all(queryPromises).then(
    ([
      {
        rows: [user],
      },
      {
        rows: [{ mandatory_spend }],
      },
      {
        rows: [{ disposable_spend }],
      },
    ]) => {
      user.mandatory_spend = mandatory_spend;
      user.disposable_spend = disposable_spend;
      return user;
    }
  );
};
