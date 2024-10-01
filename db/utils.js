const format = require("pg-format");
const db = require("./connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.checkValueExists = (table_name, column_name, value) => {
  const queryStr = format(
    "SELECT * FROM %I WHERE %I = $1;",
    table_name,
    column_name
  );
  return db.query(queryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `${column_name.toUpperCase()} NOT FOUND`,
      });
    }
  });
};
