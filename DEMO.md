# CORS DEMO

This has been tested with nodejs 8.3, it might work with newer version.

### Installation

```
npm install
```

### Run demo

Start a http server to see the tests in a browser, and start a pact-mock-service without interactions.

```
npm run demo
```

### Run tests

- a successful CORS request:

http://127.0.0.1:8000/demo/tests/cors-success/

- a CORS request that fails because of the hard-coded URL in the `Access-Control-Allow-Origin` header:

http://127.0.0.1:8000/demo/tests/cors-error/

![Image](demo/assets/cors-error.png?raw=true)

- a demo to show that `withCredentials` don't support a wildcard in the `Access-Control-Allow-Origin` header:

http://127.0.0.1:8000/demo/tests/cors-credentials/

![Image](demo/assets/cors-credentials.png?raw=true)
