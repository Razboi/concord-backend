const
	chai = require( "chai" ),
	User = require( "../../src/models/User" ),
	mongoose = require( "mongoose" ),
	tokenGenerator = require( "../../src/utils/tokenGenerator" ),
	should = chai.should(),
	expect = chai.expect;

describe( "Token generator", function() {

	before( function( done ) {
		mongoose.connect( process.env.MONGODB_URL ).then(() => done());
	});

	it( "should return a token", function( done ) {
		User.findOne({ email: "test@gmail.com" })
			.then( user => {
				const token = tokenGenerator( user );
				token.should.be.a( "string" );
				done();
			}).catch( err => done( err ));
	});

	it( "should throw an error", function( done ) {
		User.findOne({ email: "test@gmail.com" })
			.then( user => {
				const token = tokenGenerator();
				expect( token ).to.be.false;
				done();
			}).catch( err => done( err ));
	});
});
