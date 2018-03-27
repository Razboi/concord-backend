const
	express = require( "express" ),
	router = express.Router(),
	User = require( "../models/User" ),
	jwt = require( "jsonwebtoken" ),
	axios = require( "axios" ),
	tokenGenerator = require( "../utils/tokenGenerator" );


router.post( "/google", ( req, res, next ) => {
	var
		err,
		profileData;
	const
		googleToken = req.body.token;

	// if there's no token return 401 error
	if ( !googleToken ) {
		err = new Error( "Missing Google's token" );
		err.statusCode = 400;
		return next( err );
	}

	// send the token to google and get the user's data
	axios.get( "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + googleToken )
		.then( googleRes => {
			profileData = googleRes.data;

			// check if user already exists
			User.findOne({
				email: profileData.email
			})
				.then( currentUser => {

				// if already exists and doesn't have google's data
				//update the existing user and return it
					if ( currentUser ) {
						if ( !currentUser.name || !currentUser.googleID ) {
							currentUser.name = profileData.name;
							currentUser.googleID = profileData.sub;
							currentUser.save();
						}
						const token = generateToken( currentUser );
						res.send( token );

					} else {
					// if doesn't exist create a new user
						new User({
							name: profileData.name,
							googleID: profileData.sub,
							email: profileData.email
						})
							.save()
						// once is finish saving, return the new user
							.then( newUser => {
								const token = generateToken( newUser );
								res.send( token );
							})
							.catch( err => next( err ));
					}
				}).catch( err => next( err ));
		}).catch(() => {
			err = new Error( "Invalid Google token" );
			err.statusCode = 401;
			next( err );
		});
});

module.exports = router;
