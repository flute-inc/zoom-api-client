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
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users */
    users() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
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
        };
    }
}
exports.ZoomApi = ZoomApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbUFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQWlCaUI7QUFHakIsTUFBYSxPQUFPO0lBQ1IsTUFBTSxDQUFhO0lBQzNCLE1BQU0sQ0FBc0I7SUFFNUIsWUFBWSxPQUE0RDtRQUNwRSxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQUN2QyxDQUFDO0lBRUQsU0FBUyxDQUFDLE1BQTJCO1FBQ2pDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBYztRQUN0Qiw0REFBNEQ7UUFDNUQsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkIsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLFVBQVUsTUFBTSxpQkFBaUI7WUFDakUsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtTQUNoQyxDQUFRLENBQUM7SUFDZCxDQUFDO0lBRU8sYUFBYTtRQUNqQixJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLENBQUM7WUFDNUIsT0FBTztnQkFDSCxhQUFhLEVBQUUsVUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTthQUN0RCxDQUFDO1FBQ04sQ0FBQztRQUNELE1BQU0sSUFBSSxpQkFBUyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELHNGQUFzRjtJQUN0RixFQUFFO1FBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xDLENB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