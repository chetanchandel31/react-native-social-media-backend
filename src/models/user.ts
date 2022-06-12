import { v4 as uuid } from "uuid";
import crypto from "crypto";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  instaUserName: { type: String, required: true },
  bio: { type: String, required: true },
  country: { type: String, required: true },
  salt: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
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

export default mongoose.model("User", userSchema);
