const
	mongoose = require( "mongoose" ),
	bcrypt = require( "bcrypt" ),

	UserSchema = mongoose.Schema({
		name: String,
		email: { type: String, required: true },
		passwordHash: String,
		googleID: String,
		friends: [ { type: String } ],
		socketId: String
	});

UserSchema.methods.isValidPassword = function isValidPassword( password ) {
	if ( !this.passwordHash || !password ) {
		return false;
	}
	return bcrypt.compareSync( password, this.passwordHash );
};

const User = mongoose.model( "User", UserSchema );

module.exports = User;
