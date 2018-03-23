const
	socket = require( "socket.io" ),
	express = require( "express" ),
	app = express(),
	oauth = require( "./routes/oauth" ),
	auth = require( "./routes/auth" ),
	mongoose = require( "mongoose" ),
	User = require( "./models/User" ),
	jwt = require( "jsonwebtoken" ),
	// env variables
	dotenv = require( "dotenv" ).config(),
	bodyParser = require( "body-parser" ),
	// start server and add sockets
	server = app.listen( 8000, () => console.log( "Listening on 8000" )),
	io = socket( server );

// database
mongoose.connect( process.env.MONGODB_URL );

// parser middleware
app.use( bodyParser.json());
// routes middleware
app.use( "/oauth", oauth );
app.use( "/auth", auth );

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

// sockets config
io.on( "connection", client => {

	client.on( "newMessage", data => {
		// get userId from token
		const userId = jwt.verify( data.token, process.env.SECRET_JWT );
		// get user from userId
		User.findById( userId )
			.then(( user ) => {
				io.sockets.emit( "newMessage", user.email + ": " + data.message );
			})
			.catch( err => console.log( err ));
	});
});
