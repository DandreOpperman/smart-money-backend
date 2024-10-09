const db = require("../../db/connection");
const { checkValueExists } = require("../../db/utils");

exports.comparePass = (email, attemptPassword) => {
  if (!email || !attemptPassword) {
    return Promise.reject({ status: 400, msg: "BAD REQUEST" });
  }
  return checkValueExists("users", "email", email)
    .then(() => {
      return db
        .query(
          `
    SELECT (password = crypt($2, password)) AS password_match
    FROM users
    WHERE email = $1;`,
          [email, attemptPassword]
        )
        .then(({ rows: [{ password_match }] }) => {
          if (!password_match) {
            return Promise.reject({ status: 400, msg: "BAD REQUEST" });
          }
          return db.query(
            `
    SELECT user_id, email, avatar_url, fname, income, savings_target, created_at, focus_goal 
    FROM users
    WHERE email = $1;`,
            [email]
          );
        });
    })
    .then(({ rows: [user] }) => {
      return user;
    });
};
