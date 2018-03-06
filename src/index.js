const socket = require("socket.io");
const express = require("express");

const app = express();
const server = app.listen( 8000 );
const io = socket( server );

io.on( "connection", function( socket ) {
	console.log("New user");
});
