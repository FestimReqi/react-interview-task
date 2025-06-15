const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const JobSite = require("./models/JobSite");
const InventoryItem = require("./models/InventoryItem");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://inventory-managment-flex-fr.netlify.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);

    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked CORS:", origin);
      callback(new Error("Not allowed CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err.message));

/*  JOB SITE ROUTES  */

// Get all job sites
app.get("/job-sites", async (req, res) => {
  try {
    const sites = await JobSite.find();
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new job site
app.post("/job-sites", async (req, res) => {
  const data = req.body;

  try {
    let result;

    if (Array.isArray(data)) {
      // Bulk insert
      result = await JobSite.insertMany(data);
    } else {
      // Single insert
      const newJobSite = new JobSite(data);
      result = await newJobSite.save();
    }

    res.status(201).json(result);
  } catch (err) {
    console.error("Error saving job sites:", err);
    res.status(400).json({ message: err.message });
  }
});

/*  INVENTORY ROUTES  */

// Get inventory for a specific job site
app.get("/job-sites/:id/inventory", async (req, res) => {
  try {
    const items = await InventoryItem.find({ jobSiteId: req.params.id });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new inventory item for a job site
app.post("/job-sites/:id/inventory", async (req, res) => {
  try {
    const newItem = new InventoryItem({
      ...req.body,
      jobSiteId: req.params.id,
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an existing inventory item
app.put("/job-sites/:id/inventory/:itemId", async (req, res) => {
  try {
    const updated = await InventoryItem.findByIdAndUpdate(
      req.params.itemId,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/*  SERVER  */

app.listen(PORT, () => {
  console.log(`Server start at http://localhost:${PORT}`);
});
