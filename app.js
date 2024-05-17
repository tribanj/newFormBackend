// const express = require("express");
// const mongoose = require("mongoose");
// const multer = require("multer");
// const cors = require("cors");
// const app = express();

// const PORT = process.env.PORT || 3001; // Allow setting the port via environment variables

// app.use(cors());

// // MongoDB connection
// mongoose
//   .connect(
//     "mongodb+srv://tribhuwanja:9doa4xtYeWAvQpAn@cluster0.ijgu1jf.mongodb.net/FindMyCollege",
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Database connected successfully");
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database: " + error);
//   });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Define a MongoDB schema and model
// const itemSchema = new mongoose.Schema({
//   name: String,
//   description: String,
//   imageUrl: String,
//   cutoff: String,
//   ratings: String,
//   review: String,
//   renk: String,
//   fee: String,
//   cources: String,
//   courceDetails: String,
//   acceptedExams: String,
//   avgpkg: String,
//   highpkg: String,
// });

// const Item = mongoose.model("Item", itemSchema);

// app.use(express.json());

// app.post("/api/items", upload.single("image"), async (req, res) => {
//   try {
//     const newItem = new Item({
//       ...req.body, // Use object destructuring for cleaner code
//       imageUrl: req.file.path,
//     });

//     await newItem.save();
//     res.json(newItem);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).json({ error: "An error occurred while saving the item." });
//   }
// });

// app.get("/api/alldata", async (req, res) => {
//   try {
//     const data = await Item.find().lean();
//     res.json(data);
//   } catch (error) {
//     console.error("An error occurred:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// // Global error handler for unhandled exceptions and rejections
// process.on("unhandledRejection", (error) => {
//   console.error("Unhandled Promise Rejection:", error);
//   // Optionally, you can add code here to gracefully handle unhandled rejections
// });

// process.on("uncaughtException", (error) => {
//   console.error("Uncaught Exception:", error);
//   // Optionally, you can add code here to gracefully handle uncaught exceptions
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);

// });



// new code starts from here ****************************************************
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.Db_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to the database: " + error);
  });

// Multer setup for file uploads
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
const universitySchema = new mongoose.Schema({
  name: String,
  location: String,
  Founder: String,
  viceChancellor: String,
  chancellor: String,
  achievements: String,
  about: String,
  examsAccepted: String,
  highestPackage: String,
  averagePackage: String,
  ranking: String,
  approvalRecognition: String,
  courseFeeDetailsUrl: String,
  photosUrls: [String],
  prospectusUrl: String,
});

const University = mongoose.model("University", universitySchema);

// Routes
app.post(
  "/api/universities",
  upload.fields([
    { name: "courseFeeDetails", maxCount: 1 },
    { name: "photos", maxCount: 10 },
    { name: "prospectus", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        location,
        Founder,
        viceChancellor,
        chancellor,
        achievements,
        about,
        examsAccepted,
        highestPackage,
        averagePackage,
        ranking,
        approvalRecognition,
      } = req.body;

      const courseFeeDetailsUrl = req.files.courseFeeDetails
        ? req.files.courseFeeDetails[0].path
        : null;
      const photosUrls = req.files.photos
        ? req.files.photos.map((file) => file.path)
        : [];
      const prospectusUrl = req.files.prospectus
        ? req.files.prospectus[0].path
        : null;

      const newUniversity = new University({
        name,
        location,
        Founder,
        viceChancellor,
        chancellor,
        achievements,
        about,
        examsAccepted,
        highestPackage,
        averagePackage,
        ranking,
        approvalRecognition,
        courseFeeDetailsUrl,
        photosUrls,
        prospectusUrl,
      });

      await newUniversity.save();
      res.json(newUniversity);
    } catch (error) {
      console.error("An error occurred:", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving the university data." });
    }
  }
);

app.get("/api/universities", async (req, res) => {
  try {
    const data = await University.find().lean();
    res.json(data);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Global error handler for unhandled exceptions and rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
