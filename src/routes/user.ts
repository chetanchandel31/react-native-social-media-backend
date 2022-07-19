import express from "express";
import { getUserImage } from "../controllers/user";

const router = express.Router();

router.get("/users/:id/image", getUserImage);

export default router;
