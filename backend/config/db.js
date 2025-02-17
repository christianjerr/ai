import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGOURI);
    console.log(`Database connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
