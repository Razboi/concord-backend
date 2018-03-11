const socket = require("socket.io");
const express = require("express");

const app = express();
const server = app.listen( 8000 );
const io = socket( server );

io.on( "connection", client => {

	client.username = "Anonymous";

	client.on("changeUsername", username => {
		console.log( username );
		client.username = username;
	});

	client.on("disconnect", () =>
		console.log("User disconnected")
	);

	client.on("newMessage", message => {
		io.sockets.emit("newMessage", client.username + ": " + message );
	});

});
