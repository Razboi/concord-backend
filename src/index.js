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
	console.log( io.sockets.sockets );
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
		// get sender from the userId extracted from the token on registration
		User.findById( client.userId )
			.then(( sender ) => {
				// if there's no receiver send the message to everyone
				// else find the receiver by email and send the message to his socketId
				data.to == "" ?
					io.emit( "newMessage", sender.email + ": " + data.message )
					:
					User.findOne({ email: data.to })
						.then( receiver => {
							io.sockets.sockets[ receiver.socketId ].emit(
								"newMessage", sender.email + ": " + data.message
							);
						})
						.catch( err => console.log( err ));
			})
			.catch( err => console.log( err ));
	});
});
