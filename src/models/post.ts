import mongoose from "mongoose";
import {
  PostDocument,
  PostModel,
  PostSchema,
} from "../interfaces/mongoose.gen";

// image will be uploaded from FE through a `photo` field
// just put a hardcoded image in FE, TODO: later will replace it with static-url/id

const postSchema: PostSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    location: { type: String, required: true },
    picture: {
      type: String,
      default: "https://picsum.photos/id/237/600/300",
      // required: true,
    },
    date: { type: Number, required: true },
    instaId: { type: String, default: "some insta id" },
    userImage: { type: String, default: "https://picsum.photos/id/1027/100" },
    upvotes: { type: [String], default: [] },
    downvotes: { type: [String], default: [] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<PostDocument, PostModel>("Post", postSchema);
