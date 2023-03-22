import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import fooRoutes from "./routes/foo.js";
import messagesRoutes from "./routes/messages.js";

// Socket.io emitter
import { getMessages } from "./socket.io/messages.js";

// Security Packages
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";


// load env vars
dotenv.config();

// invoke express
const app = express();

// prepare server socket io

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Socket listeners
io.on("connection", (socket) => {
  console.log("user connected");
  getMessages(socket);
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
});

// invoke middlewares
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// security middleware
// rate limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(mongoSanitize()); //sanitize input to prevent NoSQL Injection
app.use(helmet()); //helmet to add headers and prevent security flaws
app.use(xssClean()); //prevent xss attacks eg <script></script> tags in db
app.use(limiter); //no of request rate limited
app.use(hpp()); //prevent http param polution

// Using the routes
app.use("/api/foo", fooRoutes);
app.use("/api/messages", messagesRoutes);

// static files in public folder
app.use(express.static(path.join(__dirname, "public")));

// Set PORT and run app
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(
    colors.green.bold(
      `App running in ${process.env.NODE_ENV} mode on port ${PORT}`
    )
  );
});
