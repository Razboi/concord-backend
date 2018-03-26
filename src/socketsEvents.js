const
	User = require( "./models/User" ),
	jwt = require( "jsonwebtoken" );

module.exports = ( io ) => {
	// sockets events
	io.on( "connection", ( client, next ) => {
		// register event saves the userId and writes the socketId to the user schema
		client.on( "register", token => {
			var userId;
			// get userId from token
			try {
				userId = jwt.verify( token, process.env.SECRET_JWT );
			} catch ( err ) {
				return err;
			}
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
							}).catch( err => {
								console.log( err );
								io.sockets.sockets[ sender.socketId ].emit(
									"newMessage", "Error: The user is offline"
								);
							});
				})
				.catch( err => console.log( err ));
		});

		client.on( "disconnect", () => {
			client.disconnect();
		});
	});
};
