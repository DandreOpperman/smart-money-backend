const format = require("pg-format");
const db = require("./connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.checkValueExists = (table_name, column_name, value) => {
  queryParams = [column_name, table_name];
  let queryStr = `SELECT %I FROM %I`;
  if (value) {
    queryStr += ` WHERE %I = $1`;
    queryParams.push(column_name);
  }
  queryStr += ";";
  const formattedQueryStr = format(queryStr, ...queryParams);
  return db.query(formattedQueryStr, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: `NOT FOUND`,
      });
    }
  });
};
