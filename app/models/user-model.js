const db = require("../../db/connection");
const { checkEmail, checkValueExists } = require("../../db/utils");

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
      if (!user) {
        return Promise.reject({ status: 404, msg: "NOT FOUND" });
      }
      user.mandatory_spend = mandatory_spend;
      user.disposable_spend = disposable_spend;
      return user;
    }
  );
};

exports.insertUser = ({ email, password, fname }) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const nameRegex = /^[A-Za-z]+([ -][A-Za-z]+)?$/;
  if (
    !emailRegex.test(email) ||
    !passRegex.test(password) ||
    !nameRegex.test(fname)
  ) {
    return Promise.reject({ status: 400, msg: "BAD REQUEST" });
  }
  return checkValueExists("users", "email", email)
    .catch(() => {
      return db.query(
        `
    INSERT INTO users
      (email, password, fname)
    VALUES
      ($1, $2, $3)
    RETURNING *;
    `,
        [email, password, fname]
      );
    })
    .then((result) => {
      if (!result) {
        return Promise.reject({ status: 409, msg: "EMAIL TAKEN" });
      }
      const user = result.rows[0];
      user.disposable_spend = user.mandatory_spend = 0.0;
      return user;
    });
};
