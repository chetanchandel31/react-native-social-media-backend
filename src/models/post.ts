import mongoose from "mongoose";
import {
  PostDocument,
  PostModel,
  PostSchema,
} from "../interfaces/mongoose.gen";

const postSchema: PostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Number, required: true },
    image: {
      data: mongoose.Schema.Types.Buffer,
      contentType: String,
    },
    instaId: { type: String, default: "some insta id" }, // TODO: check if it's same as in User and remove from here
    userImage: { type: String, default: "https://picsum.photos/id/1027/100" },
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<PostDocument, PostModel>("Post", postSchema);
