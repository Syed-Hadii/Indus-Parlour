import mongoose, { mongo } from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://indusparlour:RwPBhhExmtD1yvC5@cluster0.pnx62.mongodb.net/"
    )
    .then(() => console.log("Database Connected"));
};
