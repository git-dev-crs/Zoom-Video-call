import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.routes.js"

import { connectToSocket } from "./controllers/socketManager.js";
import { connect } from "node:http2";
// import dotenv from "dotenv";
// dotenv.config();
// await mongoose.connect(process.env.MONGO_URI);


const app = express();
const server = createServer(app);
const io =  connectToSocket(server);


app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit: "40kb", extended: true}));
app.use("/api/v1/users", userRoutes);



// app.get("/home", (req,res) =>{
//     return res.json({"hello": "creating videoApp Server!"})
// });

const start = async () => {
    app.set("mongo_user");
    const connectionDb = await mongoose.connect("mongodb+srv://mohitConferencing:mohitVideocall999@videoapp.phloixi.mongodb.net/?retryWrites=true&w=majority&appName=VideoApp")
    console.log(`MONGO Connected DB Host: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log("LISTEN ON PORT 8000")
    });
}

start();
