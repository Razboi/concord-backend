const
	express = require( "express" ),
	router = express.Router(),
	User = require( "../models/User" ),
	jwt = require( "jsonwebtoken" );

router.post( "/addFriend", ( req, res, next ) => {
	var err;
	// check if theres the necessary data
	if ( !req.body.friend ) {
		err = new Error( "No user provided" );
		err.statusCode = 400;
		return next( err );
	}
	// get userId from token
	const userId = jwt.verify( req.body.token, process.env.SECRET_JWT );
	// find user by userId
	User.findById( userId )
		.then( user => {
		// if theres no user throw error
			if ( !user ) {
				err = new Error( "Invalid session, try to log out and log in again" );
				err.statusCode = 401;
				return next( err );
			}
			// find friend
			User.findOne({ email: req.body.friend })
				.then( friend => {
					// if theres no friend throw error
					if ( !friend ) {
						err = new Error( "No user matching that username was found" );
						err.statusCode = 400;
						return next( err );
					}
					// add friend to user friends, save and return the email of the added friend
					user.friends.push( friend.email );
					user.save()
						.then(() => res.send( friend.email ))
						.catch( err => next( err ));
				})
				.catch( err => next( err ));
		})
		.catch( err => next( err ));
});

router.post( "/friends", ( req, res, next ) => {
	const userId = jwt.verify( req.body.token, process.env.SECRET_JWT );
	User.findById( userId )
		.then( user => res.send( user.friends ))
		.catch( err => next( err ));
});

module.exports = router;
