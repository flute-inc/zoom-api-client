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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbUFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQWVpQjtBQUdqQixNQUFhLE9BQU87SUFDUixNQUFNLENBQWE7SUFDM0IsTUFBTSxDQUFzQjtJQUU1QixZQUFZLE9BQTREO1FBQ3BFLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxTQUFTLENBQUMsTUFBMkI7UUFDakMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFjO1FBQ3RCLDREQUE0RDtRQUM1RCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7UUFDbEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUN2QixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksVUFBVSxNQUFNLGlCQUFpQjtZQUNqRSxNQUFNLEVBQUUsS0FBSztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO1NBQ2hDLENBQVEsQ0FBQztJQUNkLENBQUM7SUFFTyxhQUFhO1FBQ2pCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQztZQUM1QixPQUFPO2dCQUNILGFBQWEsRUFBRSxVQUFVLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO2FBQ3RELENBQUM7UUFDTixDQUFDO1FBQ0QsTUFBTSxJQUFJLGlCQUFTLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsc0ZBQXNGO0lBQ3RGLEVBQUU7UUFDRSxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEMsQ0FB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