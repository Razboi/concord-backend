const
	express = require( "express" ),
	router = express.Router(),
	User = require( "../models/User" ),
	tokenGenerator = require( "../utils/tokenGenerator" ),
	bcrypt = require( "bcrypt" );

router.post( "/login", ( req, res, next ) => {
	var err;
	if ( !req.body ) {
		err = new Error( "Empty credentials" );
		err.statusCode = 401;
		return next( err );
	}
	User.findOne({
		email: req.body.credentials.email
	})
		.then( user => {
		// if the user exists and the hashed password matches the stored hash, return token
			if ( user && user.isValidPassword( req.body.credentials.password )) {
				const token = tokenGenerator( user );
				res.send( token );
			} else {
				err = new Error( "Invalid credentials" );
				err.statusCode = 401;
				return next( err );
			}
		})
		.catch( err => next( err ));
});

router.post( "/signup", ( req, res, next ) => {
	var err;
	if ( !req.body.credentials.email || !req.body.credentials.password ) {
		err = new Error( "Empty credentials" );
		err.statusCode = 400;
		return next( err );
	}
	User.findOne({
		email: req.body.credentials.email
	})
		.then( user => {
			if ( user ) {
				err = new Error( "Email already registered" );
				err.statusCode = 422;
				return next( err );
			} else {
				new User({
					email: req.body.credentials.email,
					passwordHash: bcrypt.hashSync( req.body.credentials.password, 10 )
				})
					.save()
					.then( user => {
						const token = tokenGenerator( user );
						res.send( token );
					})
					.catch( err => next( err ));
			}
		})
		.catch( err => next( err ));
});

module.exports = router;
