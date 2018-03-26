const
	express = require( "express" ),
	router = express.Router(),
	User = require( "../models/User" ),
	jwt = require( "jsonwebtoken" );

router.post( "/addFriend", ( req, res, next ) => {
	var
		err,
		userId;
	// check if theres the necessary data
	if ( !req.body.friend ) {
		err = new Error( "No user provided" );
		err.statusCode = 400;
		return next( err );
	}
	// get userId from token
	try {
		userId = jwt.verify( req.body.token, process.env.SECRET_JWT );
	} catch ( err ) {
		// if the token is invalid throw error
		err.statusCode = 401;
		return next( err );
	}
	// find user by userId
	User.findById( userId )
		.then( user => {
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
						.then(() => res.sendStatus( 201 ))
						.catch( err => next( err ));
				})
				.catch( err => next( err ));
		})
		.catch( err => next( err ));
});

router.post( "/friends", ( req, res, next ) => {
	var userId;
	try {
		userId = jwt.verify( req.body.token, process.env.SECRET_JWT );
	} catch ( err ) {
		err.statusCode = 401;
		return next( err );
	}
	User.findById( userId )
		.then( user => res.send( user.friends ))
		.catch( err => next( err ));
});

module.exports = router;
