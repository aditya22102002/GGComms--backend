import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http"; // ⬅️ Needed to create httpServer
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';
import serverRouter from "./routes/server.routes.js";

const app = express();


const corsOptions = {
  // origin: "http://localhost:5173", 
  origin:"https://ggcomms.netlify.app",
  credentials: true,
};
app.use(cors(corsOptions));


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const httpServer = createServer(app); 


const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

io.on("connection", (socket) => {
  socket.on("send-message", ({ to, text }) => {
    io.emit("receive-message", { senderId: socket.id, receiverId: to, text });
  });

  socket.on("disconnect", () => {
    
  });
});


app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRouter);
app.use('/api/v1/servers', serverRouter);


export { app, httpServer }; 
