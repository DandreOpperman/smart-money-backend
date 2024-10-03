const db = require("../../db/connection");
const { selectUser } = require("./user-model");
const { checkValueExists } = require("../../db/utils");

exports.comparePass = (email, attemptPassword) => {
  return db
    .query(
      `
    SELECT user_id, password FROM users
    WHERE email = $1;`,
      [email]
    )
    .then(({ rows: [{ user_id, password }] }) => {
      if (password === attemptPassword) {
        return selectUser(user_id);
      } else {
        return Promise.reject({ status: 400, msg: "BAD REQUEST" });
      }
    })
    .then(({ user_id }) => {
      return user_id;
    });
};
