import { Request, Response } from "express";
import Post from "../models/post";

export const createPost = async (req: Request, res: Response) => {
  const { description, location } = req.body;

  const newPost = new Post({
    description,
    location,
    date: Date.now(),
    user: req.userFromToken?._id,
  });

  try {
    const savedPost = await newPost.save();
    await savedPost.populate("user", "-encryptedPassword -salt");

    res.status(201).json(savedPost);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message || "couldn't save post to DB" });
  }
};

export const listPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate(
      "user",
      "-encryptedPassword -salt"
    );
    res.json(posts);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "couldn't fetch list of posts" });
  }
};

export const upVotePost = async (req: Request, res: Response) => {
  const { id: postId } = req.params;
  const userId = req.userFromToken?._id.toString();

  if (!userId) return; // our `protect` middleware already ensures userId will always be there, this if-check is just to calm ts compiler down

  try {
    const post = await Post.findById(postId).populate(
      "user",
      "-encryptedPassword -salt"
    );

    let upvotes = [...(post?.upvotes || [])];
    let downvotes = [...(post?.downvotes || [])];

    if (upvotes.includes(userId)) {
      upvotes = upvotes.filter((id) => id !== userId);
    } else {
      upvotes.push(userId);
      downvotes = downvotes.filter((id) => id !== userId);
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { upvotes, downvotes },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "couldn't upvote post" });
  }
};

export const downVotePost = async (req: Request, res: Response) => {
  const { id: postId } = req.params;
  const userId = req.userFromToken?._id.toString();

  if (!userId) return; // our `protect` middleware already ensures userId will always be there, this if-check is just to calm ts compiler down

  try {
    const post = await Post.findById(postId).populate(
      "user",
      "-encryptedPassword -salt"
    );

    let upvotes = [...(post?.upvotes || [])];
    let downvotes = [...(post?.downvotes || [])];

    if (downvotes.includes(userId)) {
      downvotes = downvotes.filter((id) => id !== userId);
    } else {
      downvotes.push(userId);
      upvotes = upvotes.filter((id) => id !== userId);
    }

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      { downvotes, upvotes },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "couldn't downvote post" });
  }
};
