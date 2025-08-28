//main libs
const express = require("express");
const app = express();
//other libs
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/connectDB.js");
const { messageSocket } = require("./sockets/messageSocket.js");
const { createServer } = require("http");
const { Server } = require("socket.io");
//implementing websockets
const server = createServer(app);

//creating socket server
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
});

//pass socket server to messageSocket.js file
messageSocket(io);
// Load env variables
dotenv.config();

// Passport strategies
require("./config/passport");

// Connect to DB
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://geo-journal.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
const journalRouter = require("./routes/journalRoutes.js");
const authRouter = require("./routes/authRoutes.js");
const commentRouter = require("./routes/commentRoutes.js");
const imageRouter = require("./routes/imageRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const messageRouter = require("./routes/messageRoutes.js");

app.use("/api/journals", journalRouter);
app.use("/api/auth", authRouter);
app.use("/api/comments", commentRouter);
app.use("/api/images", imageRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);

//
// --- Google OAuth Routes ---
//

// LOGIN
app.get(
  "/api/auth/google/login",
  passport.authenticate("google-login", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/api/auth/google/login/callback",
  passport.authenticate("google-login", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=user_not_found`,
  }),
  (req, res) => {
    try {
      console.log("User object from Google login:", req.user);

      const userInfo = encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          avatar: req.user.avatar,
          firstName: req.user.firstName,
        })
      );

      const token = jwt.sign({ id: req.user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });
      res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}&userInfo=${userInfo}`
      );
    } catch (err) {
      console.error("Error in callback: ", err);
      res.redirect(`${process.env.FRONTEND_URL}/?error=callback_error`);
    }
  }
);

// REGISTER
app.get(
  "/api/auth/google/register",
  passport.authenticate("google-register", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/api/auth/google/register/callback",
  passport.authenticate("google-register", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/register?error=user_already_exists`,
  }),
  (req, res) => {
    try {
      console.log("User object from Google register: ", req.user);

      const token = jwt.sign({ id: req.user._id }, process.env.JWT_KEY, {
        expiresIn: "7d",
      });

      const userInfo = encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          username: req.user.username,
          email: req.user.email,
          firstName: req.user.firstName,
          avatar: req.user.avatar,
        })
      );
      console.log("Token received: ", token);
      res.redirect(
        `${process.env.FRONTEND_URL}/oauth-success?token=${token}&userInfo=${userInfo}`
      );
    } catch (err) {
      console.error("Error in callback: ", err);
      res.redirect(`${process.env.FRONTEND_URL}/register?error=callback_error`);
    }
  }
);

//
// --- Global Error Handling ---
//

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
