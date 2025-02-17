import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);
const Posts = mongoose.model("walls", postSchema);
export default Posts;
