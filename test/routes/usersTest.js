const
	User = require( "../../src/models/User" ),
	tokenGenerator = require( "../../src/utils/tokenGenerator" ),
	request = require( "request" ),
	chai = require( "chai" ),
	chaiHttp = require( "chai-http" ),
	dotenv = require( "dotenv" ).config(),
	mongoose = require( "mongoose" ),
	should = chai.should();

chai.use( chaiHttp );

describe( "POST addFriend", function() {

	var token;
	// before running tests find the user, generate a token and clear user friends
	before( function( done ) {
		mongoose.connect( process.env.MONGODB_URL );
		User.findOne({ email: "test@gmail.com" })
			.then( user => {
				token = tokenGenerator( user );
				user.friends = [];
				user.save()
					.then(() => done());
			});
	});

	it( "should add a new friend to the user friends", function( done ) {
		chai.request( "http://localhost:8000" )
			.post( "/users/addFriend" )
			.send({
				friend: "test2@gmail.com",
				token: token
			})
			.end(( err, res ) => {
				res.should.have.status( 201 );
				done();
			});
	});

	it( "should throw an error for not finding the user", function( done ) {
		chai.request( "http://localhost:8000" )
			.post( "/users/addFriend" )
			.send({
				friend: "invalid@gmail.com",
				token: token
			})
			.end(( err, res ) => {
				res.should.have.status( 422 );
				done();
			});
	});

	it( "should return an error for an invalid token", function( done ) {
		chai.request( "http://localhost:8000" )
			.post( "/users/addFriend" )
			.send({
				friend: "test2@gmail.com",
				token: ""
			})
			.end(( err, res ) => {
				res.should.have.status( 401 );
				done();
			});
	});
});
