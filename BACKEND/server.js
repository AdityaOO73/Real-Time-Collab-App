import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import docRoutes from "./routes/docRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import Document from "./models/Document.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*", // testing
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/docs", docRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

const server = http.createServer(app);

//  SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//  REALTIME LOGIC (SECURE VERSION)
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  //  SECURE JOIN
  socket.on("join-doc", async ({ docId, user, token }) => {
    try {
      if (!token) return;

      //  VERIFY TOKEN
      let realToken = token;

      if (token.startsWith("Bearer ")) {
        realToken = token.split(" ")[1];
      }

      const decoded = jwt.verify(realToken, process.env.JWT_SECRET);
      const userId = decoded.id;

      const doc = await Document.findById(docId);

      if (!doc) return;

      const isOwner = doc.owner.toString() === userId;

      const collaborator = doc.collaborators.find(
        (c) => c.user.toString() === userId,
      );

      //  BLOCK UNAUTHORIZED
      if (!isOwner && !collaborator) {
        console.log(" Unauthorized socket access blocked");
        return;
      }

      //  ALLOW JOIN
      socket.join(docId);

      socket.to(docId).emit("user-joined", {
        user,
        socketId: socket.id,
      });
    } catch (err) {
      console.log("Socket auth error:", err.message);
    }
  });

  //  REALTIME TEXT SYNC
  socket.on("send-changes", ({ docId, content }) => {
    socket.to(docId).emit("receive-changes", content);
  });

  //  CURSOR MOVE
  socket.on("cursor-move", ({ docId, position, user }) => {
    socket.to(docId).emit("cursor-update", {
      position,
      user,
      socketId: socket.id,
    });
  });

  //  USER DISCONNECT
  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);

    rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("user-left", socket.id);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  //  TITLE SYNC
  socket.on("title-change", ({ docId, title }) => {
    socket.to(docId).emit("receive-title", title);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
