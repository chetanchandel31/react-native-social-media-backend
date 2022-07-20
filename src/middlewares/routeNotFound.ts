import { RequestHandler } from "express";

export const routeNotFound: RequestHandler = (req, res, next) => {
  res.status(404).json({
    error: "the route you're looking for couldn't be found",
  });
};
