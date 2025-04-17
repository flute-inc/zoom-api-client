"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomApi = void 0;
const types_1 = require("./types");
class ZoomApi {
    client;
    tokens;
    constructor(options) {
        this.client = options.client;
        this.tokens = options.tokens || {};
    }
    setTokens(tokens) {
        this.tokens = tokens;
    }
    getZAKToken(userId) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return this.client.request({
            url: `${self.client.BASE_API_URL}/users/${userId}/token?type=zak`,
            method: 'GET',
            headers: self.getAuthHeader(),
        });
    }
    getAuthHeader() {
        if (this.tokens?.access_token) {
            return {
                Authorization: `Bearer ${this.tokens.access_token}`,
            };
        }
        throw new types_1.ZoomError('access_token not found');
    }
    /** From: https://marketplace.zoom.us/docs/guides/auth/oauth/#using-an-access-token */
    me() {
        return this.users().get('me');
    }
    /** From: https://developers.zoom.us/docs/api/users/#tag/groups */
    groups() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://developers.zoom.us/docs/api/users/#tag/groups/GET/groups */
            list(params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/groups`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                    params: {
                        page_size: 30,
                        ...params,
                    },
                });
            },
            /** From: https://developers.zoom.us/docs/api/users/#tag/groups/GET/groups/{groupId} */
            get(
            /**
             * The group ID.
             */
            groupId) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/groups/${groupId}`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                });
            },
            /** From: https://developers.zoom.us/docs/api/users/#tag/groups/POST/groups/{groupId}/members */
            addMembers(
            /**
             * The group ID.
             */
            groupId, 
            /**
             * List of members to add to the group.
             */
            members) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/groups/${groupId}/members`,
                    method: 'POST',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(members),
                });
            },
            /** From: https://developers.zoom.us/docs/api/users/#tag/groups/DELETE/groups/{groupId}/members/{memberId} */
            removeMember(
            /**
             * The group ID.
             */
            groupId, 
            /**
             * The member ID.
             */
            memberId) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/groups/${groupId}/members/${memberId}`,
                    method: 'DELETE',
                    headers: self.getAuthHeader(),
                });
            },
        };
    }
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users */
    users() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://developers.zoom.us/docs/api/users/#tag/users/POST/users */
            create(input) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users`,
                    method: 'POST',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(input),
                });
            },
            list(params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                    params: {
                        page_size: 30,
                        status: 'active',
                        ...params,
                    },
                });
            },
            /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/user */
            get(
            /**
             * The user ID or email address of the user. For user-level apps, pass the `me` value.
             */
            userId) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                });
            },
        };
    }
    /** From: https://developers.zoom.us/docs/api/accounts/ */
    accounts() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            settings(accountId) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/accounts/${accountId}/settings`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                });
            },
        };
    }
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/pastMeetingParticipants */
    pastMeeting(meetingId) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            details() {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/past_meetings/${meetingId}`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                });
            },
            participants(params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/past_meetings/${meetingId}/participants`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                    params: {
                        page_size: 30, // Default. Max=300
                        ...params,
                    },
                });
            },
        };
    }
    reports() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportMeetings */
            meetings(userId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/report/users/${userId}/meetings`,
                    method: 'GET',
                    params: {
                        page_size: 30,
                        type: 'past',
                        ...params,
                    },
                    headers: self.getAuthHeader(),
                });
            },
        };
    }
    meetings() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings */
            create(userId, meeting) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}/meetings`,
                    method: 'POST',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(meeting),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/PATCH/meetings/{meetingId} */
            update(meetingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}`,
                    method: 'PATCH',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/users/{userId}/meetings */
            list(userId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}/meetings`,
                    method: 'GET',
                    params: {
                        page_size: 30,
                        type: 'live',
                        ...params,
                    },
                    headers: self.getAuthHeader(),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/meetings/{meetingId} */
            get(meetingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}`,
                    method: 'GET',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/GET/meetings/{meetingId}/recordings */
            recordings(meetingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}/recordings`,
                    method: 'GET',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                });
            },
            /**
             * A quick way to get the transcript of a meeting.
             */
            transcript(url) {
                return self.client.request({
                    url,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                }, { requestTimeoutMs: 60000 });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/DELETE/meetings/{meetingId} */
            delete(meetingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}`,
                    method: 'DELETE',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/DELETE/meetings/{meetingId}/recordings/{recordingId} */
            deleteRecording(meetingId, recordingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}/recordings/${recordingId}`,
                    method: 'DELETE',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                });
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/DELETE/meetings/{meetingId}/recordings */
            deleteAllRecordings(meetingId, params) {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}/recordings`,
                    method: 'DELETE',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                });
            },
        };
    }
}
exports.ZoomApi = ZoomApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbUFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQXlCaUI7QUFHakIsTUFBYSxPQUFPO0lBQ1IsTUFBTSxDQUFhO0lBQzNCLE1BQU0sQ0FBc0I7SUFFNUIsWUFBWSxPQUE0RDtRQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsU0FBUyxDQUFDLE1BQTJCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBYztRQUN0Qiw0REFBNEQ7UUFDNUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkIsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLFVBQVUsTUFBTSxpQkFBaUI7WUFDakUsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUNoQyxDQUFRLENBQUM7SUFDZCxDQUFDO0lBRU8sYUFBYTtRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDNUIsT0FBTztnQkFDSCxhQUFhLEVBQUUsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTthQUN0RCxDQUFDO1FBQ04sQ0FBQztRQUNELE1BQU0sSUFBSSxpQkFBUyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHNGQUFzRjtJQUN0RixFQUFFO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENB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