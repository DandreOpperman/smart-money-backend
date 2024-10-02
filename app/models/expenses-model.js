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
