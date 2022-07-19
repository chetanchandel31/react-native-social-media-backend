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
  const { email, password, name, instaUserName, bio, country, image } =
    req.body;

  try {
    if (password?.length < 6) {
      return res
        .status(400)
        .json({ error: "password should be of atleast 6 characters" });
    }
    // handle image
    if (image && !image?.type?.includes("image")) {
      return res
        .status(400)
        .json({ error: "uploaded file is not a valid image" });
    }
    if (image && image?.fileSize > 3000000) {
      return res.status(400).json({ error: "image size too large" });
    }

    const newUser = new User({
      email,
      password,
      name,
      instaUserName,
      bio,
      country,
      userImage: image
        ? { data: Buffer.from(image.data, "base64"), contentType: image?.type }
        : undefined,
    });

    const savedUser = await newUser.save();

    res.json({
      email: savedUser.email,
      name: savedUser.name,
      instaUserName: savedUser.instaUserName,
      bio: savedUser.bio,
      country: savedUser.country,
      _id: savedUser._id,
    });
  } catch (err: any) {
    console.log(err);
    res.status(400).json({ error: err?.message || "signup failed" });
  }
};
