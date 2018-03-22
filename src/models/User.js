const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
	name: String,
	email: { type: String, required: true },
	passwordHash: String,
	googleID: String
});

UserSchema.methods.isValidPassword = function isValidPassword( password ) {
	if ( !this.passwordHash || password ) {
		return false;
	}
	return bcrypt.compareSync( password, this.passwordHash );
};

const User = mongoose.model("User", UserSchema );
module.exports = User;
