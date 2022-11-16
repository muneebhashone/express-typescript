import mongoose from "mongoose";

export async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
