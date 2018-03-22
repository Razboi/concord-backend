const express = require("express");
const router = express.Router();
const User = require("../models/User");
const tokenGenerator = require("../utils/tokenGenerator");
const bcrypt = require("bcrypt");

router.post("/login", (req, res, next) => {
	if ( !req.body ) {
		var err = new Error("Empty credentials");
		err.statusCode = 401;
		next( err );
	}
	User.findOne({
		email: req.body.credentials.email
	})
	.then( user => {
		// if the user exists and the hashed password matches the stored hash, return token
		if ( user && user.isValidPassword( req.body.credentials.password ) ) {
			const token = tokenGenerator( user );
			res.send( token );
		} else {
			var err = new Error("Invalid credentials");
			err.statusCode = 401;
			next( err );
		}
	})
	.catch( err => next( err ) );
});

router.post("/signup", (req, res, next) => {
	if ( !req.body ) {
		var err = new Error("Empty credentials");
		err.statusCode = 401;
		next( err );
	}
	User.findOne({
		email: req.body.credentials.email
	})
	.then( user => {
		if ( user ) {
			var err = new Error("Email already registered");
			err.statusCode = 422;
			next( err );
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
			.catch( err => next( err ) );
		}
	})
	.catch( err => next( err ) );
});

module.exports = router;
