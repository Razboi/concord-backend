const
	socket = require( "socket.io" ),
	express = require( "express" ),
	app = express(),
	oauth = require( "./routes/oauth" ),
	auth = require( "./routes/auth" ),
	users = require( "./routes/users" ),
	mongoose = require( "mongoose" ),
	// env variables
	dotenv = require( "dotenv" ).config(),
	bodyParser = require( "body-parser" ),
	// start server and add sockets
	server = require( "http" ).Server( app ),
	io = socket( server ),
	socketsEvents = require( "./socketsEvents" )( io );

server.listen( 8000, () => console.log( "Listening on 8000" ));

// database
mongoose.connect( process.env.MONGODB_URL, ( err, db ) => {
	if ( err ) {
		throw err;
	}
	console.log( "MongoDB connected" );
});

// parser middleware
app.use( bodyParser.json());
// routes middleware
app.use( "/oauth", oauth );
app.use( "/auth", auth );
app.use( "/users", users );

// error middleware
app.use(( err, req, res, next ) => {
	console.log( err );
	if ( !err.statusCode ) {
		res.status( 500 );
	} else {
		res.status( err.statusCode );
	}
	res.send( err.message );
});
