const db = require("../../db/connection");
const { checkValueExists, checkValueTaken } = require("../../db/utils");
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
  if (!user_id || !name || !cost) {
    return Promise.reject({ status: 400, msg: "BAD REQUEST" });
  }

  const queryProms = [];
  let queryStr = `
  INSERT INTO monthly_expenses
    (name, cost, user_id)
  VALUES
    ($1, $2, $3)
  RETURNING *;
  `;
  queryProms.push(checkValueExists("users", "user_id", user_id));
  queryProms.push(checkValueTaken("monthly_expenses", "name", name, user_id));
  queryProms.push(db.query(queryStr, [name, cost, user_id]));
  return Promise.all(queryProms).then((result) => {
    if (!result) {
      return Promise.reject({ status: 409, msg: "Expense already exists" });
    }
    return result[2].rows[0];
  });
};

exports.updateExpense = (monthly_expense_id, patchBody) => {
  const queryProms = [];
  const queryParams = [];
  const allowedColumns = ["cost", "name"];
  let count = Object.keys(patchBody).length;
  let queryStr = "UPDATE monthly_expenses SET ";

  for (const key in patchBody) {
    if (!allowedColumns.includes(key)) {
      return Promise.reject({ status: 400, msg: "BAD REQUEST" });
    }
    const value = patchBody[key];
    queryStr += `${key} = $${count + 1}`;
    queryParams.unshift(value);
    queryStr += count > 1 ? ", " : " ";
    count--;
  }

  queryParams.unshift(monthly_expense_id);

  queryStr += `WHERE monthly_expense_id = $1 RETURNING *;`;
  queryProms.push(db.query(queryStr, queryParams));
  queryProms.push(
    checkValueExists(
      "monthly_expenses",
      "monthly_expense_id",
      monthly_expense_id
    )
  );
  return Promise.all(queryProms).then(
    ([
      {
        rows: [expense],
      },
    ]) => {
      return expense;
    }
  );
};
exports.removeExpense = (monthly_expense_id) => {
  const queryProms = [];
  let queryStr = `
          DELETE FROM monthly_expenses
          WHERE monthly_expense_id = $1 RETURNING *;
          `;
  queryProms.push(
    checkValueExists(
      "monthly_expenses",
      "monthly_expense_id",
      monthly_expense_id
    )
  );
  queryProms.push(db.query(queryStr, [monthly_expense_id]));
  return Promise.all(queryProms);
};
