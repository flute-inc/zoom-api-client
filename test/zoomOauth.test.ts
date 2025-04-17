import { ZoomClient, ZoomEventRequest, ZoomOauth } from '../src';
import nock from 'nock';

const clientId = 'dummy';
const clientSecret = 'dummy';
const redirectUri = 'dummy';
const verificationKey = 'dummy';
const tokens = {
    access_token: 'dummy',
    token_type: 'bearer',
    refresh_token: 'dummy',
    expires_in: 3599,
    scope: 'user:read:admin',
};

const reqheaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64',
    )}`,
};

let client: ZoomClient;
let oauth: ZoomOauth;

beforeEach(() => {
    client = new ZoomClient({
        clientId,
        clientSecret,
        redirectUri,
        verificationKey,
    });
    oauth = new ZoomOauth(client);
});

test('authorizationUrl', () => {
    const state = { hello: 'world' };
    const stateStr = JSON.stringify(state);
    const url = oauth.getAuthorizationUrl(stateStr);

    const usp = new URLSearchParams({
        response_type: 'code',
        redirect_uri: client.redirectUri as string,
        client_id: client.clientId,
        state: stateStr,
    });

    expect(url).toBe(
        `${client.BASE_OAUTH_URL}/oauth/authorize?${usp.toString()}`,
    );
});

test('requestTokens', async () => {
    const code = 'dummy';
    const scope = nock(client.BASE_OAUTH_URL)
        .post(
            '/oauth/token',
            `grant_type=authorization_code&redirect_uri=${redirectUri}&code=${code}`,
            { reqheaders },
        )
        .reply(200, tokens);
    const resp = await oauth.requestTokens(code);
    expect(resp).toEqual(tokens);
    scope.done();
});

test('refreshTokens', async () => {
    const refreshToken = 'dummy';
    const scope = nock(client.BASE_OAUTH_URL)
        .post(
            '/oauth/token',
            `grant_type=refresh_token&refresh_token=${refreshToken}`,
            { reqheaders },
        )
        .reply(200, tokens);
    await oauth.refreshTokens(refreshToken);
    scope.done();
});

test('revokeTokens', async () => {
    const accessToken = 'dummy';
    const scope = nock(client.BASE_OAUTH_URL)
        .post('/oauth/revoke', `token=${accessToken}`, { reqheaders })
        .reply(200, tokens);
    await oauth.revokeTokens(accessToken);
    scope.done();
});

test('verifyEvent:  No verification key provided', async () => {
    const event: ZoomEventRequest = {
        body: {
            payload: { client_id: '1', signature: 'random' },
            event: 'randomid',
        },
        headers: {},
    };

    client = new ZoomClient({
        clientId,
        clientSecret,
        redirectUri,
    });
    oauth = new ZoomOauth(client);
    let throwError;
    try {
        oauth.verifyEvent(event);
    } catch (err) {
        throwError = err;
    }
    expect(throwError).toEqual(expect.anything());
});

test('verifyEvent:  with verification key provided', async () => {
    const headers = { authorization: 'authorization-random' };
    const payload = { client_id: 'dummy', signature: 'random' };
    const event = {
        body: {
            payload,
            event: 'randomid',
        },
        headers,
    };

    const result =
        headers.authorization === verificationKey &&
        payload.client_id === clientId;
    expect(oauth.verifyEvent(event)).toEqual(result);
});

test('verifyEvent: with matching verification key but different client_id', async () => {
    const headers = { authorization: verificationKey };
    const payload = { client_id: 'different-client-id', signature: 'random' };
    const event = {
        body: {
            payload,
            event: 'randomid',
        },
        headers,
    };

    expect(oauth.verifyEvent(event)).toEqual(false);
});

test('verifyEvent: with matching client_id but different verification key', async () => {
    const headers = { authorization: 'different-verification-key' };
    const payload = { client_id: clientId, signature: 'random' };
    const event = {
        body: {
            payload,
            event: 'randomid',
        },
        headers,
    };

    expect(oauth.verifyEvent(event)).toEqual(false);
});

test('verifyEvent: with both matching verification key and client_id', async () => {
    const headers = { authorization: verificationKey };
    const payload = { client_id: clientId, signature: 'random' };
    const event = {
        body: {
            payload,
            event: 'randomid',
        },
        headers,
    };

    expect(oauth.verifyEvent(event)).toEqual(true);
});
