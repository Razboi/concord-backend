const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../utils/tokenGenerator");


router.post("/google", (req, res) => {
	const profile = req.body.profile;
	// check if user already exists
	User.findOne({
		googleID: profile.googleId
	})
	.then( currentUser => {
		// if already exists in the db return the existing user
		if ( currentUser ) {
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
			.catch( err => console.log( err ) );
		}
	});
});

module.exports = router;
