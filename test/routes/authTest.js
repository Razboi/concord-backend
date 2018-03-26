const
	request = require( "request" ),
	chai = require( "chai" ),
	chaiHttp = require( "chai-http" ),
	should = chai.should();

chai.use( chaiHttp );

describe( "POST auth", function() {
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
