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

    res.json({
      token,
      user: {
        email: user.email,
        name: user.name,
        instaUserName: user.instaUserName,
        bio: user.bio,
        country: user.country,
        _id: user._id,
      },
    });
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
    const { email, name, instaUserName, bio, country, _id } =
      await newUser.save();

    res.json({ email, name, instaUserName, bio, country, _id });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err?.message || "signup failed" });
  }
};
