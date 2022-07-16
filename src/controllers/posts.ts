import { Request, Response } from "express";
import Post from "../models/post";

export const createPost = async (req: Request, res: Response) => {
  const { description, location, image } = req.body;

  try {
    // handle image
    if (!image?.type?.includes("image")) {
      return res
        .status(400)
        .json({ error: "uploaded file is not a valid image" });
    }
    if (image?.fileSize > 3000000) {
      return res.status(400).json({ error: "image size too large" });
    }

    // convert base 64 to buffer
    const imageBuffer = Buffer.from(image.data, "base64");
    const imageType = image.type;

    const newPost = new Post({
      description,
      location,
      date: Date.now(),
      user: req.userFromToken?._id,
      image: { data: imageBuffer, contentType: imageType },
    });

    const savedPost = await newPost.save();
    await savedPost.populate("user", "-encryptedPassword -salt");

    res.status(201).json(savedPost);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error?.message || "couldn't save post to DB" });
  }
};

export const listPosts = async (_req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .select("-image")
      .populate("user", "-encryptedPassword -salt");
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
    ).select("-image");
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
    ).select("-image");
    res.json(updatedPost);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "couldn't downvote post" });
  }
};

export const getPostImage = async (req: Request, res: Response) => {
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "no post with the given id found" });
    }
    res.set("Content-Type", post.image.contentType);
    return res.send(post.image.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "couldn't get an image" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id: postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .select("-image")
      .populate("user", "-encryptedPassword -salt");

    if (!post) {
      return res.status(404).json({ error: "no post with the given id found" });
    }

    if (req.userFromToken?._id.toString() !== post.user?._id.toString()) {
      return res
        .status(402)
        .json({ error: "you are not authorised to delete this post" });
    }

    const deletedPost = await post.remove();
    res.status(200).json({ success: true, deletedPost });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "couldn't delete the post" });
  }
};
