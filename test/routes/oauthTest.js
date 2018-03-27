const
	chai = require( "chai" ),
	chaiHttp = require( "chai-http" ),
	request = require( "request" ),
	should = chai.should();

chai.use( chaiHttp );

describe( "POST oauth", function() {

	it( "should return error 401 for missing the Google token", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/oauth/google" )
			.end(( err, res ) => {
				res.should.have.status( 400 );
				done();
			});
	});

	it( "should return error 500 for invalid Google token", function( done ) {
		chai.request( "localhost:8000" )
			.post( "/oauth/google" )
			.send({ token: "123123asdasda1231233" })
			.end(( err, res ) => {
				res.should.have.status( 401 );
				done();
			});
	});
});
