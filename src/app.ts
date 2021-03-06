import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { UserDocument } from "./interfaces/mongoose.gen";
import { addFakeDelayBeforeResponse } from "./middlewares/addFakeDelayBeforeResponse";
import { errorHandler } from "./middlewares/errorHandler";
import { routeNotFound } from "./middlewares/routeNotFound";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import userRoutes from "./routes/user";

dotenv.config();

// to be able to add custom properties to request via middlewares
declare global {
  namespace Express {
    interface Request {
      userFromToken?: UserDocument;
    }
  }
}

const app = express();

// middlewares
app.use(express.json({ limit: "50mb" })); // these let us access req.body, w/o limit property we get "request too large"
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(addFakeDelayBeforeResponse(app.settings.env));
// app.use(cookieParser());

// routes
app.get("/api", (req, res) => res.send("backend app is up and running"));
app.use("/api", postRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// handle errors and 404s
app.use(routeNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 7000;

// connect with DB and start listening
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("DB CONNECTED"));

app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
