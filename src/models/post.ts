import mongoose from "mongoose";

// image will be uploaded from FE through a `photo` field
// just put a hardcoded image in FE, TODO: later will replace it with static-url/id

const postSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    location: { type: String, required: true },
    picture: {
      type: String,
      default: "https://picsum.photos/id/237/600/300",
      // required: true,
    },
    by: { type: String, required: true },
    date: { type: Number, required: true },
    instaId: { type: String, default: "some insta id" },
    userImage: { type: String, default: "https://picsum.photos/id/1027/100" },
    // // TODO: similar to how we like/unlike
    // votesMap: {
    //   type: Map,
    //   of: {
    //     type: { type: String, enum: ["upvote", "downvote"] },
    //   },
    //   default: {},
    // },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
