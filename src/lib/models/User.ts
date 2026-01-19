import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["admin", "member", "developer"],
    default: "member",
    required: true,
  },
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
