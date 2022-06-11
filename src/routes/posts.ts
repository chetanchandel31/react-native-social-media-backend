import express from "express";
import { createPost, listPosts } from "../controllers/posts";

const router = express.Router();

// TODO: endpoints for upvoting and downvoting posts
router.get("/posts", listPosts);
router.post("/posts", createPost);

export default router;
