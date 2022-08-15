import mongoose from "mongoose";
import {
  PostDocument,
  PostModel,
  PostSchema,
} from "../interfaces/mongoose.gen";

const { Buffer, ObjectId } = mongoose.Schema.Types;

const postSchema: PostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Number, required: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    user: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<PostDocument, PostModel>("Post", postSchema);
