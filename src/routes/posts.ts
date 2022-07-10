import express from "express";
import {
  createPost,
  downVotePost,
  getPostImage,
  listPosts,
  upVotePost,
} from "../controllers/posts";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/posts", listPosts);
router.get("/posts/:id/image", getPostImage);
router.post("/posts", protect, createPost);
router.post("/posts/:id/upvote", protect, upVotePost);
router.post("/posts/:id/downvote", protect, downVotePost);

export default router;
