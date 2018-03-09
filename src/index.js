const socket = require("socket.io");
const express = require("express");

const app = express();
const server = app.listen( 8000 );
const io = socket( server );

io.on( "connection", client => {
	console.log("New user");

	client.on("disconnect", () =>
		console.log("User disconnected")
	);

	client.on("newMessage", message => {
		io.sockets.emit("newMessage", message );
	});

});
