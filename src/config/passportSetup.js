const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

generateToken = user => {
	const token = jwt.sign( user.id, "secret_jwt" );
	console.log( token );
	return token;
};


passport.use(
	new GoogleStrategy({
		// api keys from google+
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: "/oauth/google/redirect"
	}, (accessToken, refreshToken, profile, cb) => {
		// callback
		// check if user already exists
		User.findOne({
			googleID: profile.id
		})
		.then( currentUser => {
			// if already exists in the db return the existing user
			if ( currentUser ) {
				console.log("user already exists");
				generateToken( currentUser );
				return cb( null, currentUser );
			}
			// if doesn't exists create a new user
			new User({
				name: profile.displayName,
				googleID: profile.id
			})
			.save()
			// once is finish saving, return the new user
			.then( newUser => {
				console.log( newUser );
				generateToken( newUser );
				return cb( null, newUser );
				})
			.catch( err => console.log( err ) );
		});
	})
);
