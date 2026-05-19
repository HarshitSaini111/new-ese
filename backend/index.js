const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const app = express();

// ======================
// Middleware
// ======================

app.use(cors());
app.use(express.json());

// ======================
// MongoDB Connection
// ======================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ======================
// Complaint Schema
// ======================

const ComplaintSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },

  priority: {
    type: String,
    default: "Medium",
  },

  department: {
    type: String,
    default: "General",
  },

  aiResponse: {
    type: String,
  },

  summary: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Complaint = mongoose.model("Complaint", ComplaintSchema);

// ======================
// User Schema
// ======================

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

// ======================
// JWT Middleware
// ======================

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {

    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = verified;

    next();

  } catch (error) {

    res.status(400).json({
      message: "Invalid Token",
    });

  }
};

// ======================
// Signup API
// ======================

app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Signup Successful",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Login API
// ======================

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Add Complaint API
// ======================

app.post("/api/complaints", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      description,
      category,
      location,
    } = req.body;

    // Validation

    if (!title) {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // AI Logic

    let priority = "Medium";
    let department = "General";
    let aiResponse = "Your complaint has been registered.";
    let summary = description.substring(0, 60);

    if (description.toLowerCase().includes("electricity")) {
      priority = "High";
      department = "Electricity Department";
    }

    if (description.toLowerCase().includes("water")) {
      department = "Water Department";
    }

    if (description.toLowerCase().includes("garbage")) {
      department = "Sanitation Department";
    }

    const newComplaint = new Complaint({
      name,
      email,
      title,
      description,
      category,
      location,
      priority,
      department,
      aiResponse,
      summary,
    });

    await newComplaint.save();

    res.status(201).json({
      message: "Complaint Added Successfully",
      complaint: newComplaint,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Get All Complaints
// ======================

app.get("/api/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Search Complaint by Location
// ======================

app.get("/api/complaints/search", async (req, res) => {
  try {
    const location = req.query.location;

    const complaints = await Complaint.find({
      location: {
        $regex: location,
        $options: "i",
      },
    });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Update Complaint Status
// ======================

app.put("/api/complaints/:id", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// Delete Complaint
// ======================

app.delete("/api/complaints/:id", async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      message: "Complaint Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ======================
// AI Analyze API
// ======================
app.post("/api/ai/analyze", async (req, res) => {

  try {

    const { complaint } = req.body;

    const prompt = `

Analyze this complaint:

"${complaint}"

Return:
1. Priority
2. Department
3. Summary
4. Auto Response

`;

    const response = await axios.post(

      "https://openrouter.ai/api/v1/chat/completions",

      {

        model: "openai/gpt-4o-mini",

        max_tokens: 200,

        messages: [
          {
            role: "user",
            content: prompt
          }
        ]

      },

      {

        headers: {

          Authorization:
            `Bearer ${process.env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json"

        }

      }

    );

    res.json({

      success: true,

      aiResponse:
        response.data
          .choices[0]
          .message.content

    });

  } catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

    res.status(500).json({

      success: false,

      message: error.message

    });

  }

});

// ======================
// Default Route
// ======================

app.get("/", (req, res) => {
  res.send("AI Complaint Management Backend Running");
});

// ======================
// Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});