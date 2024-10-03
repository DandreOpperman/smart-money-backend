const db = require("../../db/connection");
const { checkValueExists } = require("../../db/utils");

exports.selectUserID = (email) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!emailRegex.test(email)) {
    return Promise.reject({ status: 400, msg: "BAD REQUEST" });
  }
  return checkValueExists("users", "email", email)
    .then(() => {
      return db.query(
        `
        SELECT user_id FROM users
        WHERE email = $1`,
        [email]
      );
    })
    .then(({ rows: [user_id] }) => {
      return user_id;
    });
};
