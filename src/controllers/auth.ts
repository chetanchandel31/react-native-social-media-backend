import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "user not found" });

    if (user?.getEncryptedPassword(password) !== user?.encryptedPassword)
      return res.status(400).json({ error: "incorrect details" });

    // generate token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET as string);

    // don't want to send salt and password in response
    user.encryptedPassword = undefined;
    user.salt = undefined;

    res.json({ token, user });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err?.message || "signin failed" });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password, name, instaUserName, bio, country } = req.body;
  const newUser = new User({
    email,
    password,
    name,
    instaUserName,
    bio,
    country,
  });

  if (password?.length < 6)
    return res
      .status(400)
      .json({ error: "password should be of atleast 6 characters" });

  try {
    const savedUser = await newUser.save();

    // don't want to send salt and password in response
    savedUser.encryptedPassword = undefined;
    savedUser.salt = undefined;

    res.json(savedUser);
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err?.message || "signup failed" });
  }
};
