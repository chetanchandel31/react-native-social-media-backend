import { Request, Response } from "express";

export const listPosts = (req: Request, res: Response) => {
  res.json(["hi", "hi2"]);
};
