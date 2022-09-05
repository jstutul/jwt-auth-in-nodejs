import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./Routes/AuthRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDb");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoeesDB Disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("mongoeesDB Connected");
});

app.get("/", (req, res) => {
  res.send("THIS IS  API");
});

app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});
app.listen(4000, () => {
  connect();
  console.log("Connected to Backend");
});
