# Zoom API Client

This node package aims to provide a dependency-free and 100% typed and tested Zoom Api Client.

The code is heavily inspired by GoogleApis package.

## Installation

```sh
npm install @flute-inc/zoom-api-client
```

## Usage

For now, this package includes only those APIs which Nektar uses. You can easily extend the functionality in your project and even contribute directly over here!

### Error Handling

This package provides detailed error information when API calls fail. All errors include:

- **HTTP Status Code**: The HTTP status code returned by Zoom API
- **Status Text**: The HTTP status text (e.g., "Bad Request", "Unauthorized")
- **Request URL**: The URL that was called
- **Request Method**: The HTTP method used (GET, POST, etc.)
- **Response Body**: The complete response body from Zoom API
- **Operation Context**: Additional context about the operation being performed

Example error handling:

```js
import { ZoomOauth, ZoomError } from '@flute-inc/zoom-api-client';

try {
  const tokens = await zoomOauth.refreshTokens(refreshToken);
} catch (error) {
  if (error instanceof ZoomError) {
    console.error('Error message:', error.message);
    console.error('HTTP Status:', error.details.status);
    console.error('Response Body:', error.details.responseBody);
    console.error('Operation:', error.details.operation);
  }
}
```

Common error scenarios and their details:

- **Token Refresh Failures**: Includes refresh token context and operation type
- **Authentication Errors**: Includes authorization code context
- **API Rate Limiting**: Includes rate limit headers and retry information
- **Network Timeouts**: Includes timeout duration and request details

### ZoomClient

This is the core provider of all authentication and requests for Zoom.
It is recommended to create only one `ZoomClient` instance for all Oauth (non-S2SO) purposes.

```js
import {ZoomClient} from '@flute-inc/zoom-api-client';

const zoomClient = new ZoomClient({
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    redirectUri: process.env.ZOOM_REDIRECT_URI,
    verificationKey: process.env.ZOOM_VERIFICATION_KEY, // optional
});
```

### ZoomOauth

To use the Zoom's Oauth functionality

```js
import {ZoomS2SO} from '@flute-inc/zoom-api-client';

const zoomOauth = new ZoomOauth(zoomClient);

expressRouter.get('/zoom/oauth', (req, res) => {
  const state = {userId: req.params.userId};
  res.redirect(zoomOauth.getAuthorizationUrl(state));
});
```

### ZoomS2SO

To use Zoom's Server-to-server oauth functionality

```js
import {ZoomClient, ZoomS2SO} from '@flute-inc/zoom-api-client';

const zoomClient = new ZoomClient({
  // S2SO credentials
})
const zoomS2so = new ZoomS2SO(zoomClient);
```

### ZoomApi

To use Zoom Api's after authentication

```js
import {ZoomApi} from '@flute-inc/zoom-api-client';

...

expressRouter.get('/zoom/oauth/callback', async (req, res) => {
  const {state, code} = req.query;
  const stateParsed = JSON.parse(state);
  const tokens =  await zoomOauth.requestTokens(code);
  const zoomApi = new ZoomApi({
    client: zoomClient, // oauth or s2so
    tokens,
  });
  const userInfo = zoomApi.me();
  const result = await db.read(`SELECT * from "zoomUsers" where id='${userInfo.id}'`);
  if (result.size) res.end('Auth successful!');
  else res.end('Auth failed!');
});
```

## Contribution

(WIP)

1. Clone the repo
1. Install dependencies with `npm install`
1. Add additional APIs in `src/` and tests in `test/`
1. Make sure tests pass and raise a PR
1. Take feedback, make iterative changes, and wait for your changes to be published!

## [Changelog](./CHANGELOG.md)
