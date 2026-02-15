const { log } = require("console");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const http = require("http");
const path = require("path");

const{checkForAuthenticationCookie , requireAuth} = require("./middleware/authentication");

//cookie
const cookieParser = require("cookie-parser");

const {Server}= require("socket.io");

const userRouter = require("./routes/user");

//connecting mongodb
const PORT = process.env.PORT || 7000;
mongoose
.connect(process.env.MONGODB_URI)
.then((e)=>console.log(`MongoDb connected at : ${PORT}`));

const app = express();
const server = http.createServer(app);

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:3000", // React frontend
  credentials: true               // allows cookies to be sent
}));


//some of the middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

//websocket connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'], // Add this
  allowEIO3: true // Add this for compatibility
});


app.use("/user" , userRouter);

//socket.io

io.on("connection", (socket)=>{
    console.log("User connected");

    socket.on("user-message", (message) =>{
        console.log("Message received:", message);
        io.emit("message", message);
    });
});



server.listen(PORT,console.log(`server started at Port : ${PORT}`));