import { Request, Response } from "express";
import Post from "../models/post";

// TODO: endpoints for upvoting and downvoting posts
export const createPost = async (req: Request, res: Response) => {
  console.log(req.body);
  const { description, location, by } = req.body;
  const newPost = new Post({ description, location, by, date: Date.now() });

  try {
    const savedPost = await newPost.save();

    res.json(savedPost);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message || "couldn't save post to DB" });
  }
};

export const listPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "couldn't fetch list of posts" });
  }
};
