import express from "express";
import { listPosts } from "../controllers/posts";

const router = express.Router();

router.get("/list-posts", listPosts);

export default router;
