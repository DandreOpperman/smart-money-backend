const db = require("../../db/connection");
const { removeAllGoals } = require("./goals-model");
const { removeAllTransactions } = require("./transactions-model");
const { checkValueExists } = require("../../db/utils");

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
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$£!%*?&])[A-Za-z\d@$£!%*?&]{8,}$/;
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
      ($1, crypt($2, gen_salt('md5')), $3)
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

exports.updateUser = (user_id, patchBody) => {
  return checkValueExists("users", "user_id", user_id)
    .then(() => {
      const queryParams = [];
      const allowedColumns = [
        "email",
        "password",
        "avatar_url",
        "fname",
        "income",
        "savings_target",
        "focus_goal",
      ];

      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      const passRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$£!%*?&])[A-Za-z\d@$£!%*?&]{8,}$/;
      const nameRegex = /^[A-Za-z]+([ -][A-Za-z]+)?$/;

      const validateRegex = [emailRegex, passRegex, nameRegex];
      const propsToValidate = ["email", "password", "fname"];

      for (let [index, prop] of propsToValidate.entries()) {
        if (Object.keys(patchBody).includes(prop)) {
          if (!validateRegex[index].test(patchBody[prop])) {
            return Promise.reject({ status: 400, msg: "BAD REQUEST" });
          }
        }
      }

      let count = Object.keys(patchBody).length;
      let queryStr = "UPDATE users SET ";

      for (const key in patchBody) {
        if (!allowedColumns.includes(key)) {
          return Promise.reject({ status: 400, msg: "BAD REQUEST" });
        }
        const value = patchBody[key];
        key === "password"
          ? (queryStr += `password = crypt($${count + 1}, gen_salt('md5'))`)
          : (queryStr += `${key} = $${count + 1}`);
        queryParams.unshift(value);
        queryStr += count > 1 ? ", " : " ";
        count--;
      }

      queryParams.unshift(user_id);
      queryStr += `WHERE user_id = $1 RETURNING *;`;
      return db.query(queryStr, queryParams);
    })
    .then(({ rows: [user] }) => {
      return user;
    });
};

exports.removeUser = (user_id) => {
  return removeAllGoals(user_id)
    .then(() => {
      return db.query(
        //replace this with removeAllTags
        `
    DELETE FROM transactions_tags TT
    USING transactions TR
    WHERE TT.transaction_id = TR.transaction_id
    AND TR.user_id = $1;
    `,
        [user_id]
      );
    })
    .then(() => {
      return removeAllTransactions(user_id);
    })
    .then(() => {
      return db.query(
        //replace this with removeAllExpenses
        `
    DELETE FROM monthly_expenses
    WHERE user_id = $1;`,
        [user_id]
      );
    })
    .then(() => {
      return db.query(
        `
    DELETE FROM users
    WHERE user_id = $1;
    `,
        [user_id]
      );
    });
};
