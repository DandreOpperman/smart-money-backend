const db = require("../../db/connection");
const { checkValueExists } = require("../../db/utils");
exports.selectExpenses = (user_id) => {
  const queryPromises = [];
  const userPromise = db.query(
    `
      SELECT * FROM monthly_expenses
      WHERE user_id = $1`,
    [user_id]
  );
  queryPromises.push(checkValueExists("users", "user_id", user_id));
  queryPromises.push(userPromise);
  return Promise.all(queryPromises).then((data) => {
    let output = data[1].rows;
    if (!output) {
      return Promise.reject({ status: 404, msg: "NOT FOUND" });
    }
    return output;
  });
};
exports.insertExpense = (user_id, { name, cost }) => {
  console.log(name, cost, user_id, "<--");
  return checkValueExists("monthly_expenses", "name", name)
    .catch(() => {
      return db.query(
        `
      INSERT INTO monthly_expenses
        (name, cost, user_id)
      VALUES
        ($1, $2, $3)
      RETURNING *;
      `,
        [name, cost, user_id]
      );
    })
    .then((result) => {
      console.log(result);
      if (!result) {
        return Promise.reject({ status: 409, msg: "Expense already exists" });
      }
      const expense = result.rows[0];
    });
};
