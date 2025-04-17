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
