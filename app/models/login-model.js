const db = require("../../db/connection");

exports.comparePass = (email, attemptPassword) => {
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
    SELECT user_id FROM users
    WHERE email = $1;`,
        [email]
      );
    })
    .then(({ rows: [user_id] }) => {
      return user_id;
    });
};
