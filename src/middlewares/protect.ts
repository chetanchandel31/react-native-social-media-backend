import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

/** ensures there's a valid req token in headers and populates `req.userFromToken` */
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "YOU NEED TO BE SIGNED IN" });
    }
    const decodedData =
      typeof process.env.SECRET === "string" &&
      jwt.verify(token, process.env.SECRET);

    const relatedUser =
      decodedData &&
      typeof decodedData !== "string" &&
      (await User.findById(decodedData?._id));

    if (!relatedUser) return res.status(401).json({ error: "INVALID TOKEN" });

    req.userFromToken = relatedUser;

    next();
  } catch (error: any) {
    console.log(error, "SOMETHING WENT WRONG WHILE AUTHORISING");
    res.status(500).json({
      error: error?.message || "SOMETHING WENT WRONG WHILE AUTHORISING",
    });
  }
};
