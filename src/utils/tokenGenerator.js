const jwt = require("jsonwebtoken");

generateToken = user => {
	const token = jwt.sign( user.id, process.env.SECRET_JWT );
	return token;
};

module.exports = generateToken;
