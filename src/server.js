const express = require("express"); 
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Initialize Express and Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP and WebSocket Server
const server = http.createServer(app);
const io = new Server(server);

// MongoDB Atlas Connection
const mongoURI = "YOUR API KEY";
mongoose.set("strictQuery", true);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Event Schema and Model
const eventSchema = new mongoose.Schema({
  code: { 
    type: String, 
    unique: true, 
    required: true,
    default: () => crypto.randomBytes(4).toString('hex') // Generate 8-character unique code
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Event = mongoose.model("Event", eventSchema);

// Photo Schema and Model
const photoSchema = new mongoose.Schema({
  eventCode: { 
    type: String, 
    required: true
  },
  photoPath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const Photo = mongoose.model("Photo", photoSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// WebSocket Connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join event-specific room
  socket.on("joinEvent", (eventCode) => {
    console.log(`User joined event: ${eventCode}`);
    socket.join(eventCode);
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// API Routes
app.post("/api/events", async (req, res) => {
  const { name, code } = req.body;
  try {
    const newEvent = new Event({ name, code });
    const savedEvent = await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: savedEvent });
  } catch (err) {
    console.error("Error creating event:", err);
    res.status(500).json({ error: "Error creating event" });
  }
});

app.post("/api/upload-photo", upload.single("photo"), async (req, res) => {
  const { eventCode } = req.body;
  if (!req.file) {
    return res.status(400).json({ error: "No photo uploaded" });
  }

  try {
    const newPhoto = new Photo({
      eventCode,
      photoPath: req.file.path
    });
    const savedPhoto = await newPhoto.save();

    // Emit photo-uploaded event to the specific event room
    io.to(eventCode).emit("photoUploaded", {
      eventCode: savedPhoto.eventCode,
      photoPath: savedPhoto.photoPath,
      uploadedAt: savedPhoto.uploadedAt,
    });

    res.status(201).json({ message: "Photo uploaded successfully", photo: savedPhoto });
  } catch (err) {
    console.error("Error uploading photo:", err);
    res.status(500).json({ error: "Error uploading photo" });
  }
});
app.delete("/api/photos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPhoto = await Photo.findByIdAndDelete(id);
    if (!deletedPhoto) {
      return res.status(404).json({ error: "Photo not found" });
    }
    // Emit event
    io.to(deletedPhoto.eventCode).emit("photoDeleted", id);
    res.status(200).json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error("Error deleting photo:", err);
    res.status(500).json({ error: "Error deleting photo" });
  }
});



app.get("/api/events/:code/photos", async (req, res) => {
  const { code } = req.params;
  try {
    const photos = await Photo.find({ eventCode: code });
    res.status(200).json(photos);
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).json({ error: "Error fetching photos" });
  }
});

// Static File Serving for Uploaded Photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
