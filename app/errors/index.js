exports.psqlErrorHandler = (err, req, res, next) => {
  if (["22P02", "23502"].includes(err.code)) {
    res.status(400).send({ msg: "BAD REQUEST" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "NOT FOUND" });
  } else next(err);
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.serverErrorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "INTERNAL SERVER ERROR" });
};
