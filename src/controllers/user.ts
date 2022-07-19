import User from "../models/user";
import { Request, Response } from "express";

export const getUserImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "no user with the given id found" });
    }

    if (!user.userImage.data) {
      return res.sendFile(`${__dirname}/images/default-user-pfp.png`);
    }

    res.set("Content-Type", user.userImage.contentType);
    res.send(user.userImage.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "couldn't get an image" });
  }
};
