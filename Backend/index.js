import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
// All Routers are below..
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import serviceRouter from "./routes/serviceRoute.js";
import packageRouter from "./routes/packageRoute.js";
import customerRouter from "./routes/customerRoute.js";
import purchaseRouter from "./routes/purchaseRoute.js";
import stockRouter from "./routes/stockRoute.js";
import expenseRouter from "./routes/expenseRoute.js";
import staffRouter from "./routes/staffRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import regularBookingRouter from "./routes/regularBookingRoute.js";

const app = express();
const port = 3003;
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/user", userRouter)
app.use("/product", productRouter)
app.use("/service", serviceRouter)
app.use("/package", packageRouter)
app.use("/booking", bookingRouter)
app.use("/regular_booking", regularBookingRouter);
app.use("/customer", customerRouter)
app.use("/purchase", purchaseRouter)
app.use("/stock", stockRouter)
app.use("/expense", expenseRouter)
app.use("/staff", staffRouter)

// DB Connection
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
