import { ZoomApi, ZoomClient } from '../src';
import { ZoomApi$Reports$Meetings } from '../src';
import nock from 'nock';
import { URLSearchParams } from 'url';
const clientId = 'dummy';
const clientSecret = 'dummy';
const accountId = 'dummy';

let client: ZoomClient;
let zoomApi: ZoomApi;

beforeEach(() => {
    client = new ZoomClient({
        clientId,
        clientSecret,
        accountId,
    });
    zoomApi = new ZoomApi({ client, tokens: { access_token: 'dummy' } });
});

it('getZAKToken', async () => {
    const userId = 'randomId';
    const resp = { token: 'dummy' };
    const scope = nock(client.BASE_API_URL)
        .get(`/users/${userId}/token?type=zak`)
        .reply(200, resp);
    expect(await zoomApi.getZAKToken(userId)).toEqual(resp);
    scope.done();
});
it('me', async () => {
    const resp = { id: 1, name: 'dummy' };
    const scope = nock(client.BASE_API_URL).get('/users/me').reply(200, resp);
    expect(await zoomApi.me()).toEqual(resp);
    scope.done();
});
it('users() list', async () => {
    const resp = [
        { id: 1, name: 'dummy' },
        { id: 2, name: 'dummy2' },
    ];
    const scope = nock(client.BASE_API_URL)
        .get('/users?page_size=30&status=active')
        .reply(200, resp);
    expect(await zoomApi.users().list()).toEqual(resp);
    scope.done();
});
it('users() get one user', async () => {
    const userId = 'randomId';
    const resp = { id: 1, name: 'dummy' };
    const scope = nock(client.BASE_API_URL)
        .get(`/users/${userId}`)
        .reply(200, resp);
    expect(await zoomApi.users().get(userId)).toEqual(resp);
    scope.done();
});
it('pastMeeting() details', async () => {
    const meetingId = 'randomId';
    const resp = { id: 1, event: 'dummy' };
    const scope = nock(client.BASE_API_URL)
        .get(`/past_meetings/${meetingId}`)
        .reply(200, resp);
    expect(await zoomApi.pastMeeting(meetingId).details()).toEqual(resp);
    scope.done();
});
it('pastMeeting() get participants', async () => {
    const meetingId = 'randomId';
    const resp = [
        { id: 1, name: 'dummy' },
        { id: 2, name: 'dummy2' },
    ];
    const scope = nock(client.BASE_API_URL)
        .get(`/past_meetings/${meetingId}/participants?page_size=30`)
        .reply(200, resp);
    expect(await zoomApi.pastMeeting(meetingId).participants()).toEqual(resp);
    scope.done();
});

it('reports() meetings', async () => {
    const userId = 'randomId';
    const params: ZoomApi$Reports$Meetings = {
        from: 'dummy',
        to: 'dummy',
        page_size: 30,
        next_page_token: 'abc',
        page_count: 0,
        total_records: 0,
        meetings: [],
    };
    const resp = [
        { id: 1, name: 'dummy' },
        { id: 2, name: 'dummy2' },
    ];
    const paramsStr = new URLSearchParams({
        ...params,
        type: 'past',
    } as unknown as Record<string, string>).toString();
    const scope = nock(client.BASE_API_URL)
        .get(`/report/users/${userId}/meetings?${paramsStr}`)
        .reply(200, resp);
    expect(await zoomApi.reports().meetings(userId, params)).toEqual(resp);
    scope.done();
});

it('meetings() list', async () => {
    const userId = 'randomId';
    const params = {
        page_size: '30',
        type: 'scheduled',
        next_page_token: 'random',
        page_number: '30',
    };
    const resp = [
        { id: 1, name: 'dummy' },
        { id: 2, name: 'dummy2' },
    ];
    const paramsStr = new URLSearchParams(
        params as Record<string, string>,
    ).toString();
    const scope = nock(client.BASE_API_URL)
        .get(`/users/${userId}/meetings?${paramsStr}`)
        .reply(200, resp);
    expect(await zoomApi.meetings().list(userId, params as any)).toEqual(resp);
    scope.done();
});

it('meetings() list', async () => {
    const meetingId = 'randomId';
    const params = {
        occurence_id: '1',
        show_previous_occurences: true,
    };
    const resp = { id: 2, name: 'dummy' };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .get(`/meetings/${meetingId}?${paramsStr}`)
        .reply(200, resp);
    expect(await zoomApi.meetings().get(meetingId, params as any)).toEqual(
        resp,
    );
    scope.done();
});

it('meetings() create', async () => {
    const body = {
        topic: 'dummy',
        type: 2,
    };
    const resp = { id: 2, name: 'dummy' };
    const scope = nock(client.BASE_API_URL)
        .post(`/users/me/meetings`, body)
        .reply(201, resp);
    expect(await zoomApi.meetings().create('me', body as any)).toEqual(resp);
    scope.done();
});

it('meetings() recordings', async () => {
    const meetingId = 'randomId';
    const params = {
        include_fields: 'dummy',
    };
    const resp = { id: 2, name: 'dummy' };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .get(`/meetings/${meetingId}/recordings?${paramsStr}`)
        .reply(200, resp);
    expect(
        await zoomApi.meetings().recordings(meetingId, params as any),
    ).toEqual(resp);
    scope.done();
});

it('meetings() deleteRecording', async () => {
    const meetingId = 'randomId';
    const recordingId = 'recordingId';
    const params = {
        action: 'trash',
    };
    const resp = { success: true };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .delete(`/meetings/${meetingId}/recordings/${recordingId}?${paramsStr}`)
        .reply(200, resp);
    expect(
        await zoomApi.meetings().deleteRecording(meetingId, recordingId, params as any),
    ).toEqual(resp);
    scope.done();
});

it('meetings() deleteAllRecordings', async () => {
    const meetingId = 'randomId';
    const params = {
        action: 'delete',
    };
    const resp = { success: true };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .delete(`/meetings/${meetingId}/recordings?${paramsStr}`)
        .reply(200, resp);
    expect(
        await zoomApi.meetings().deleteAllRecordings(meetingId, params as any),
    ).toEqual(resp);
    scope.done();
});

it('users() create', async () => {
    const input = {
        action: 'create',
        user_info: {
            email: 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            type: 1,
        },
    };
    const resp = {
        id: 'userId',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        type: 1,
    };
    const scope = nock(client.BASE_API_URL)
        .post('/users', input)
        .reply(201, resp);
    expect(await zoomApi.users().create(input as any)).toEqual(resp);
    scope.done();
});

it('accounts() settings', async () => {
    const accountId = 'accountId';
    const resp = {
        id: 'settingsId',
        settings: {
            option1: true,
            option2: false,
        },
    };
    const scope = nock(client.BASE_API_URL)
        .get(`/accounts/${accountId}/settings`)
        .reply(200, resp);
    expect(await zoomApi.accounts().settings(accountId)).toEqual(resp);
    scope.done();
});

it('meetings() update', async () => {
    const meetingId = 'meetingId';
    const params = {
        topic: 'Updated Meeting Topic',
        duration: 60,
    };
    const resp = {
        id: meetingId,
        topic: 'Updated Meeting Topic',
        duration: 60,
    };
    const scope = nock(client.BASE_API_URL)
        .patch(`/meetings/${meetingId}`, params)
        .reply(200, resp);
    expect(await zoomApi.meetings().update(meetingId, params as any)).toEqual(resp);
    scope.done();
});

it('meetings() transcript', async () => {
    const transcriptUrl = 'https://example.com/transcript.vtt';
    const resp = 'WEBVTT\n\n00:00:00.000 --> 00:00:05.000\nHello, this is a test transcript.';
    const scope = nock('https://example.com')
        .get('/transcript.vtt')
        .reply(200, resp);
    expect(await zoomApi.meetings().transcript(transcriptUrl)).toEqual(resp);
    scope.done();
});

it('setTokens', () => {
    const newTokens = { access_token: 'new-token', refresh_token: 'new-refresh' };
    zoomApi.setTokens(newTokens);
    expect(zoomApi.tokens).toEqual(newTokens);
});

it('getAuthHeader throws error when access_token is not found', () => {
    const apiWithoutToken = new ZoomApi({ client, tokens: {} });
    expect(() => {
        // @ts-ignore - Accessing private method for testing
        apiWithoutToken.getAuthHeader();
    }).toThrow('access_token not found');
});

it('constructor with tokens parameter', () => {
    const tokens = { access_token: 'test-token', refresh_token: 'test-refresh' };
    const api = new ZoomApi({ client, tokens });
    expect(api.tokens).toEqual(tokens);
});

it('constructor with empty tokens parameter', () => {
    const api = new ZoomApi({ client, tokens: {} });
    expect(api.tokens).toEqual({});
});

it('meetings() delete', async () => {
    const meetingId = 'meetingId';
    const params = {
        occurrence_id: 'occurrenceId',
        schedule_for_reminder: true,
    };
    const resp = { success: true };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .delete(`/meetings/${meetingId}?${paramsStr}`)
        .reply(200, resp);
    expect(await zoomApi.meetings().delete(meetingId, params as any)).toEqual(resp);
    scope.done();
});

it('groups() list', async () => {
    const params = {
        page_size: 30,
        page_number: 1,
    };
    const resp = {
        next_page_token: '',
        page_count: 1,
        page_number: 1,
        page_size: 30,
        total_records: 2,
        groups: [
            {
                id: 'groupId1',
                name: 'Group 1',
                total_members: 5,
            },
            {
                id: 'groupId2',
                name: 'Group 2',
                total_members: 10,
            },
        ],
    };
    const paramsStr = new URLSearchParams(params as any).toString();
    const scope = nock(client.BASE_API_URL)
        .get(`/groups?${paramsStr}`)
        .reply(200, resp);
    expect(await zoomApi.groups().list(params)).toEqual(resp);
    scope.done();
});

it('groups() get', async () => {
    const groupId = 'groupId1';
    const resp = {
        id: groupId,
        name: 'Group 1',
        total_members: 5,
    };
    const scope = nock(client.BASE_API_URL)
        .get(`/groups/${groupId}`)
        .reply(200, resp);
    expect(await zoomApi.groups().get(groupId)).toEqual(resp);
    scope.done();
});

it('groups() addMembers', async () => {
    const groupId = 'groupId1';
    const members = {
        members: [
            {
                email: 'user1@example.com',
            },
            {
                email: 'user2@example.com',
            },
        ],
    };
    const resp = {
        added_members: [
            {
                id: 'userId1',
                email: 'user1@example.com',
            },
            {
                id: 'userId2',
                email: 'user2@example.com',
            },
        ],
    };
    const scope = nock(client.BASE_API_URL)
        .post(`/groups/${groupId}/members`, members)
        .reply(200, resp);
    expect(await zoomApi.groups().addMembers(groupId, members)).toEqual(resp);
    scope.done();
});

it('groups() removeMember', async () => {
    const groupId = 'groupId1';
    const memberId = 'userId1';
    const resp = { success: true };
    const scope = nock(client.BASE_API_URL)
        .delete(`/groups/${groupId}/members/${memberId}`)
        .reply(200, resp);
    expect(await zoomApi.groups().removeMember(groupId, memberId)).toEqual(resp);
    scope.done();
});
