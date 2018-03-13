const socket = require("socket.io");
const express = require("express");
const app = express();
const passportSetup = require("./config/passportSetup");
const oauth = require("./routes/oauth");
const mongoose = require("mongoose");
// env variables
const dotenv = require("dotenv").config();


// database
mongoose.connect( process.env.MONGODB_URL );
// routes
app.use("/oauth", oauth );

// start server and add sockets
const server = app.listen( 8000, () => console.log("Listening on 8000") );
const io = socket( server );

// sockets config
io.on( "connection", client => {
	client.username = "Anonymous";

	client.on("changeUsername", username => {
		console.log( username );
		client.username = username;
	});

	client.on("newMessage", message => {
		io.sockets.emit("newMessage", client.username + ": " + message );
	});
});
