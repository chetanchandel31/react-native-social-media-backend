import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack, "unhandled error 👋"); // this should call a logger at scale.
  res.status(500).json({ error: err.message });
};
