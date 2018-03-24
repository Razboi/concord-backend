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
	server = require( "http" ).Server( app ),
	io = socket( server );

server.listen( 8000, () => console.log( "Listening on 8000" ));

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

	// register event saves the userId and writes the socketId to the user schema
	client.on( "register", token => {
		// get userId from token
		userId = jwt.verify( token, process.env.SECRET_JWT );
		// saves the clientId to the socket session
		client.userId = userId;
		// get user and set sockedId
		User.findById( userId )
			.then(( user ) => {
				user.socketId = client.id;
				user.save();
			})
			.catch( err => console.log( err ));
	});

	client.on( "newMessage", data => {
		console.log( socket.to );
		// get user from userId
		User.findById( client.userId )
			.then(( user ) => {
				data.to == "" ?
					io.emit( "newMessage", user.email + ": " + data.message )
					:
					User.find({ email: data.to })
						.then( user => {
							console.log( user );
							client.to[ user.socketId ].emit(
								"newMessage", user.email + ": " + data.message
							);
						})
						.catch( err => console.log( err ));
			})
			.catch( err => console.log( err ));
	});
});
