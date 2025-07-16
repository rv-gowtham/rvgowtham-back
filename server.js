require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://rvgowtham.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/", (req, res) => {
  try {
    res.send("Backend is running perfectly");
  } catch (e) {
    res.send(e.message);
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: "Data saved successfully!" });
    console.log({ message: "Data saved successfully !" });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
