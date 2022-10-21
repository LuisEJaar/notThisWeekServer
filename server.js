const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");

//Routes
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const playerRoutes = require("./routes/player");
const encounterRoutes = require("./routes/encounters");
const roundRoutes = require("./routes/rounds");
const characterRoutes = require("./routes/characters");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
app.use("/player", playerRoutes);
app.use("/encounter", encounterRoutes);
app.use("/round", roundRoutes);
app.use("/character", characterRoutes);


//Socket.io 
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    //URL for the front end
    origin: `${process.env.CLIENT_ADDRESS}`,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

io.on("connection", (socket) => {
  console.log(`Socket user Connected: ${socket.id}`)

  socket.on("join_room", (data) => {
    socket.join(data);
  })
  
  socket.on("send_roundRefresh", (data) => {
    socket.to(data.room).emit("receive_roundRefresh", data)
  })

  socket.on("send_controlRefresh", (data) => {
    socket.to(data.room).emit("receive_controlRefresh", data)
  })
})

//Server Running
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on ${port}`);
  console.log(`http://localhost:${port}/`);
});
