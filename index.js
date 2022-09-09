import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./Routes/AuthRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
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
app.use("/uploads", express.static("uploads"));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

app.post("/uploadfile", upload.single("img"), (req, res, next) => {
  if (!req.file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    res.status(400).json({ message: "Image required" });
  }
  res.status(200).json({ message: "Image Upload Successfully" });
});

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
