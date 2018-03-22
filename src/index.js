const socket = require("socket.io");
const express = require("express");
const app = express();
const oauth = require("./routes/oauth");
const auth = require("./routes/auth");
const mongoose = require("mongoose");
// env variables
const dotenv = require("dotenv").config();
var bodyParser = require("body-parser");

// database
mongoose.connect( process.env.MONGODB_URL );

// parser middleware
app.use( bodyParser.json() );

// routes middleware
app.use("/oauth", oauth );

app.use("/auth", auth );

// error middleware
app.use( (err, req, res, next ) => {
	console.log( err );
	if ( !err.statusCode ) {
		res.status( 500 );
	} else {
		res.status( err.statusCode );
	}
	res.send( err.message );
});

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
