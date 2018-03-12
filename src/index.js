const socket = require("socket.io");
const express = require("express");
const passportSetup = require("./config/passportSetup");
const passport = require("passport");

const app = express();


app.get("/oauth/google", passport.authenticate("google", {
		scope: [ "profile" ]
	}) );

const server = app.listen( 8000 );
const io = socket( server );

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
