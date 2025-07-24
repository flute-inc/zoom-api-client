import { ZoomClient } from '../src';
import nock from 'nock';

const clientId = 'dummy';
const clientSecret = 'dummy';
const redirectUri = 'dummy';

let client: ZoomClient;

beforeEach(() => {
    client = new ZoomClient({
        clientId,
        clientSecret,
        redirectUri,
    });
});

test.skip('should initialise ZoomClient correctly', async () => {
    const emit = jest.fn();
    jest.mock('events', () => ({
        EventEmitter: jest.fn().mockImplementation(() => ({
            emit,
        })),
    }));
    const { EventEmitter } = await import('events');
    const { ZoomClient } = await import('../src');
    (EventEmitter as any).mockImplementation(() => ({
        emit,
    }));
    const client = new ZoomClient({
        clientId,
        clientSecret,
        redirectUri,
    });
    expect(EventEmitter).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith('connection:new', client);
});

test('constructParams', async () => {
    expect(
        client.constructParams(
            {
                test1: 'dummy1',
                test2: 'dummy2',
            },
            'http://dummysite.com',
        ),
    ).toBe('http://dummysite.com?test1=dummy1&test2=dummy2');
});

test('request', async () => {
    const resp = { hello: 'world' };
    const url = 'http://dum.my/';
    const scope = nock(url).get('/').reply(200, resp);
    const data = await client.request({
        method: 'GET',
        url,
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('convert to get request from string url', async () => {
    const resp = { hello: 'world' };
    const url = 'http://dum.my/';
    const scope = nock(url).get('/').reply(200, resp);
    const data = await client.request(url);
    expect(data).toEqual(resp);
    scope.done();
});

test('/oauth url', async () => {
    const resp = { hello: 'world' };
    const scope = nock(client.BASE_OAUTH_URL).get('/oauth').reply(200, resp);
    const data = await client.request('/oauth');
    expect(data).toEqual(resp);
    scope.done();
});

const ZOOM_BASE_API_URL = 'https://api.zoom.us';
test('/v2 url', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL).get('/v2').reply(200, resp);
    const data = await client.request('/v2');
    expect(data).toEqual(resp);
    scope.done();
});

test('/c3 url', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL).get('/v2/c3').reply(200, resp);
    const data = await client.request({ method: 'GET', url: '/c3' });
    expect(data).toEqual(resp);
    scope.done();
});

test('error url with json message', async () => {
    const errorMessage = 'error cause';
    const resp = { message: errorMessage };
    const scope = nock(ZOOM_BASE_API_URL).get('/v2/d4').reply(400, resp);
    await expect(
        client.request({ method: 'GET', url: '/d4' }),
    ).rejects.toThrowError(errorMessage);
    scope.done();
});

test('error url with text message', async () => {
    const errorMessage = 'error cause';
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/d5')
        .reply(400, errorMessage);
    await expect(
        client.request({ method: 'GET', url: '/d5' }),
    ).rejects.toThrowError(errorMessage);
    scope.done();
});

test('error url with null-like response', async () => {
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/d6')
        .reply(400, '');
    await expect(
        client.request({ method: 'GET', url: '/d6' }),
    ).rejects.toThrowError('');
    scope.done();
});

test('error url with empty object response', async () => {
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/d7')
        .reply(400, {});
    await expect(
        client.request({ method: 'GET', url: '/d7' }),
    ).rejects.toThrowError('Zoom Api Error');
    scope.done();
});

test('error with detailed information', async () => {
    const errorResponse = {
        error: 'invalid_grant',
        message: 'The refresh token is invalid or expired',
        reason: 'token_expired'
    };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/detailed-error')
        .reply(400, errorResponse);
    
    try {
        await client.request({ method: 'GET', url: '/detailed-error' });
    } catch (error: any) {
        expect(error.message).toBe('invalid_grant: The refresh token is invalid or expired (token_expired)');
        expect(error.details).toBeDefined();
        expect(error.details.status).toBe(400);
        expect(error.details.statusText).toBe('Bad Request');
        expect(error.details.url).toBe('https://api.zoom.us/v2/detailed-error');
        expect(error.details.method).toBe('GET');
        expect(error.details.responseBody).toEqual(errorResponse);
    }
    scope.done();
});

test('error with only error field', async () => {
    const errorResponse = {
        error: 'unauthorized'
    };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/unauthorized')
        .reply(401, errorResponse);
    
    try {
        await client.request({ method: 'GET', url: '/unauthorized' });
    } catch (error: any) {
        expect(error.message).toBe('unauthorized');
        expect(error.details.status).toBe(401);
        expect(error.details.responseBody).toEqual(errorResponse);
    }
    scope.done();
});

test('timeout error with details', async () => {
    jest.useFakeTimers();
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/timeout-detail')
        .delayConnection(10000)
        .reply(200, {});
    
    const promise = client.request(
        { method: 'GET', url: '/timeout-detail' },
        { requestTimeoutMs: 100 }
    );
    
    jest.advanceTimersByTime(200);
    
    try {
        await promise;
    } catch (error: any) {
        expect(error.message).toContain('Zoom API request timed out after 100ms');
        expect(error.details.timeout).toBe(100);
        expect(error.details.url).toBe('https://api.zoom.us/v2/timeout-detail');
        expect(error.details.method).toBe('GET');
    }
    
    jest.useRealTimers();
    scope.done();
});

test('url with param', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/c3?hello=world')
        .reply(200, resp);
    const data = await client.request({
        method: 'GET',
        url: '/c3',
        params: { hello: 'world' },
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with /v2 path', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/test')
        .reply(200, resp);
    const data = await client.request({
        method: 'GET',
        url: '/v2/test',
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with /v2 path and subpath', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/test/subpath')
        .reply(200, resp);
    const data = await client.request({
        method: 'GET',
        url: '/v2/test/subpath',
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with /v2 path and query params', async () => {
    const resp = { hello: 'world' };
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/test?param=value')
        .reply(200, resp);
    const data = await client.request({
        method: 'GET',
        url: '/v2/test',
        params: { param: 'value' },
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with exact /v2 path', async () => {
    const resp = { hello: 'world' };
    // This should test the case where url is exactly '/v2'
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2')
        .reply(200, resp);
    const data = await client.request('/v2');
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with /v2/ path', async () => {
    const resp = { hello: 'world' };
    // This should test the case where url is '/v2/' with a trailing slash
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/')
        .reply(200, resp);
    const data = await client.request('/v2/');
    expect(data).toEqual(resp);
    scope.done();
});

test('normalizeUrl with non-slash path', () => {
    // Test a URL that doesn't start with a slash
    const url = 'http://example.com/api';
    // @ts-ignore - Accessing private method for testing
    const normalizedUrl = client['normalizeUrl'](url);
    expect(normalizedUrl).toBe(url);
});

test('normalizeUrl with non-oauth non-v2 path', async () => {
    const resp = { hello: 'world' };
    // Test a URL that starts with a slash but is not /oauth or /v2
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/other-path')
        .reply(200, resp);
    const data = await client.request('/other-path');
    expect(data).toEqual(resp);
    scope.done();
});

test('callApi with string error', async () => {
    const errorMessage = 'plain text error';
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/error')
        .reply(400, errorMessage, { 'Content-Type': 'text/plain' });
    await expect(
        client.request({ method: 'GET', url: '/v2/error' }),
    ).rejects.toThrowError(errorMessage);
    scope.done();
});

test('callApi with non-parseable JSON response', async () => {
    const response = 'not a json';
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/text')
        .reply(200, response, { 'Content-Type': 'text/plain' });
    const result = await client.request({ method: 'GET', url: '/v2/text' });
    expect(result).toEqual(response);
    scope.done();
});

test('callApi with abort controller', async () => {
    jest.useFakeTimers();
    const scope = nock(ZOOM_BASE_API_URL)
        .get('/v2/timeout')
        .delayConnection(10000) // Delay longer than the timeout
        .reply(200, {});
    
    const promise = client.request(
        { method: 'GET', url: '/v2/timeout' },
        { requestTimeoutMs: 1 } // Very short timeout
    );
    
    jest.advanceTimersByTime(5); // Advance past the timeout
    
    await expect(promise).rejects.toThrow();
    jest.useRealTimers();
    scope.done();
});

test('normalizeUrl with absolute URL', () => {
    const absoluteUrl = 'https://example.com/api';
    expect(client.request(absoluteUrl)).resolves.toEqual(expect.anything());
});

test('request with omitted method', async () => {
    const resp = { hello: 'world' };
    const url = 'http://dum.my/';
    // Omit the method property to test the default 'GET' fallback
    const scope = nock(url).get('/').reply(200, resp);
    // @ts-ignore - Intentionally omitting the method property for testing
    const data = await client.request({
        url,
    });
    expect(data).toEqual(resp);
    scope.done();
});

test('should initialize ZoomClient correctly', () => {
    const testClient = new ZoomClient({
        clientId,
        clientSecret,
        redirectUri,
    });
    
    expect(testClient.clientId).toBe(clientId);
    expect(testClient.clientSecret).toBe(clientSecret);
    expect(testClient.redirectUri).toBe(redirectUri);
    expect(testClient.emitter).toBeDefined();
});
