import express from "express";
import {
  createPost,
  downVotePost,
  listPosts,
  upVotePost,
} from "../controllers/posts";
import { protect } from "../middlewares/protect";

const router = express.Router();

router.get("/posts", listPosts);
router.post("/posts", protect, createPost);
router.post("/posts/:id/upvote", protect, upVotePost);
router.post("/posts/:id/downvote", protect, downVotePost);

export default router;
