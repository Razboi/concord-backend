const
	request = require( "request" ),
	chai = require( "chai" ),
	chaiHttp = require( "chai-http" ),
	mongoose = require( "mongoose" ),
	User = require( "../../src/models/User" ),
	should = chai.should();

chai.use( chaiHttp );

describe( "POST auth( login )", function() {

	it( "should return a token and status 200", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/login" )
			.send({
				credentials: {
					email: "test@gmail.com",
					password: "test"
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 200 );
				res.text.should.be.a( "string" );
				done();
			});
	});

	it( "should return error 401 for EMPTY credentials", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/login" )
			.send({
				credentials: {
					email: "",
					password: ""
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 401 );
				done();
			});
	});

	it( "should return error 401 for INVALID credentials", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/login" )
			.send({
				credentials: {
					email: "test@gmail.com",
					password: "123"
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 401 );
				done();
			});
	});
});

describe( "POST auth( signup )", function() {

	before( function( done ) {
		mongoose.connect( process.env.MONGODB_URL );
		User.remove({ email: "newtest@gmail.com" })
			.then(() => {
				done();
			});
	});

	it( "should return a token and status 200", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/signup" )
			.send({
				credentials: {
					email: "newtest@gmail.com",
					password: "newtest"
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 200 );
				res.text.should.be.a( "string" );
				done();
			});
	});

	it( "should return error 401 for EMPTY credentials", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/signup" )
			.send({
				credentials: {
					email: "",
					password: ""
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 400 );
				done();
			});
	});

	it( "should return error 422 for already registered email", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/auth/signup" )
			.send({
				credentials: {
					email: "test@gmail.com",
					password: "123"
				}
			})
			.end(( err, res ) => {
				res.should.have.status( 422 );
				done();
			});
	});
});
