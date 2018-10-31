describe('Test with mocha', function() {

    var pact;

    before(function(done) {
        pact = new Pact.PactWeb({
            port: 1234,
            consumer: 'Foo',
            provider: 'Bar',
            logLevel: 'DEBUG',
            log: '../../../log/pact-web.log',
            dir: '../../../pacts'
        });
        pact.addInteraction({
            uponReceiving: 'a CORS request with matchers for Access-Control-Allow-Origin',
            withRequest: {
                method: 'GET',
                path: '/foo',
                headers: {
                    'Origin': Pact.Matchers.somethingLike('http://myservice.com')
                }
            },
            willRespondWith: {
                status: 200,
                headers: {
                    // because of the xhr.withCredentials = true, this wil now fail if you try to use a wildcard

                    // Browser CORS error:
                    // Access to XMLHttpRequest at 'http://localhost:1234/foo' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy.
                    // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
                    // The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
                    'Access-Control-Allow-Origin': Pact.Matchers.somethingLike('*')
                },
                body: 'Hello world'
            }
        })
        .then(function() {
            done();
        })
        .catch(done);
    });

    after(function(done) {
        pact.finalize()
            .then(function() {
                done();
            })
            .catch(done);
    });

    it('should make a request using XHR', function(done) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.addEventListener('error', function() {
            console.log('- test error');
            done(new Error('Could not make the xhr request'));
        });
        xhr.addEventListener('load', function() {
            console.log('- test completed with success');
            done();
        });
        xhr.open('get', 'http://localhost:1234/foo');
        // xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    });

});
