import { v4 as uuid } from "uuid";
import crypto from "crypto";
import mongoose from "mongoose";
import {
  UserDocument,
  UserModel,
  UserSchema,
} from "../interfaces/mongoose.gen";

const { Buffer } = mongoose.Schema.Types;

// TODO: maybe should have a field to store user's postIds too, so we can delete all of them when user is deleted

const userSchema: UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  instaUserName: { type: String, required: true },
  bio: { type: String, required: true },
  country: { type: String, required: true },
  salt: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  userImage: {
    data: Buffer,
    contentType: String,
  },
});

userSchema.virtual("password").set(function (plainPassword) {
  this.salt = uuid();
  this.encryptedPassword = this.getEncryptedPassword(plainPassword);
});

userSchema.methods = {
  getEncryptedPassword: function (plainPassword: string) {
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch (err) {
      console.log(err, "couldn't encrypt password");
      return "";
    }
  },
};

export default mongoose.model<UserDocument, UserModel>("User", userSchema);
