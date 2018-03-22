const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../utils/tokenGenerator");


router.post("/google", (req, res, next) => {
	const profile = req.body.profile;
	// if theres no profile go to the error handler middleware
	if ( !profile ) {
		var err = new Error("Google didn't sent any user information");
		err.statusCode = 401;
		return next( err );
	}
	// check if user already exists
	User.findOne({
		email: profile.email
	})
	.then( currentUser => {
		// if already exists update the existing user with google data and return it
		if ( currentUser ) {
			if ( !currentUser.name || !currentUser.googleID ) {
				console.log("updated");
				currentUser.name = profile.name;
				currentUser.googleID = profile.googleId;
				currentUser.save();
			}
			const token = generateToken( currentUser );
			res.send( token );
		} else {
			// if doesn't exists create a new user
			new User({
				name: profile.name,
				googleID: profile.googleId,
				email: profile.email
			})
			.save()
			// once is finish saving, return the new user
			.then( newUser => {
				const token = generateToken( newUser );
				res.send( token );
				})
			.catch( err => next( err ) );
		}
	}).catch( err => next( err ) );
});

module.exports = router;
