const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const keys = require("./keys");
const User = require("../models/User");

passport.use(
	new GoogleStrategy({
		// api keys from google+
		clientID: keys.google.clientID,
		clientSecret: keys.google.clientSecret,
		callbackURL: "/oauth/google/redirect"
	}, (token, tokenSecret, profile, done) => {
		// callback
		// check if user already exists
		User.findOne({
			googleID: profile.id
		})
		.then( currentUser => {
			if ( currentUser ) {
				console.log("user already exists");
			} else {
				new User({
					name: profile.displayName,
					googleID: profile.id
				})
				.save()
				// once is finish saving the new user
				.then( newUser => console.log( newUser ) )
				.catch( err => console.log( err ) );
			}
		});
	})
);
