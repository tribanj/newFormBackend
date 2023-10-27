const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001; // Allow setting the port via environment variables

app.use(cors());

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://tribhuwanja:9doa4xtYeWAvQpAn@cluster0.ijgu1jf.mongodb.net/FindMyCollege",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
  });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Define a MongoDB schema and model
const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  imageUrl: String,
  cutoff: String,
  ratings: String,
  review: String,
  renk: String,
  fee: String,
  cources: String,
  courceDetails: String,
  acceptedExams: String,
  avgpkg: String,
  highpkg: String,
});

const Item = mongoose.model("Item", itemSchema);

app.use(express.json());

app.post("/api/items", upload.single("image"), async (req, res) => {
  try {
    const newItem = new Item({
      ...req.body, // Use object destructuring for cleaner code
      imageUrl: req.file.path,
    });

    await newItem.save();
    res.json(newItem);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "An error occurred while saving the item." });
  }
});

app.get("/api/alldata", async (req, res) => {
  try {
    const data = await Item.find().lean();
    res.json(data);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Global error handler for unhandled exceptions and rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  // Optionally, you can add code here to gracefully handle unhandled rejections
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  // Optionally, you can add code here to gracefully handle uncaught exceptions
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
