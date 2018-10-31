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
            uponReceiving: 'a CORS request with a hard-coded value for Access-Control-Allow-Origin',
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
                    // This is what I'm trying to make sure:
                    // I need to make sure that this service returns a correct URL in the Access-Control-Allow-Origin header
                    // so that a client from the right URL can request it without being blocked
                    // Setting a URL prevents me to access to the pact-mock-service.
                    // FYI, a Wildcard is also not an option with "withCredentials", see other example (demo/tests/cors-credentials).
                    // the error is visible in the browser console (which is not a Pact error, the pact-mock-service behaves correctly):
                    //
                    // Browser CORS error:
                    // (index):1 Access to XMLHttpRequest at 'http://localhost:1234/foo' from origin 'http://127.0.0.1:8000' has been blocked by CORS policy:
                    // The 'Access-Control-Allow-Origin' header has a value 'http://myservice.com' that is not equal to the supplied origin.
                    'Access-Control-Allow-Origin': 'http://myservice.com'
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
