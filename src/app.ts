import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/posts";

dotenv.config();

const app = express();

// middlewares
app.use(express.json()); // these let us access req.body
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.use(cookieParser());

// routes
app.get("/api", (req, res) => res.send("app is up and running"));
app.use("/api", postRoutes);

const PORT = process.env.PORT || 7000;

// connect with DB and start listening
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("DB CONNECTED"));

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
