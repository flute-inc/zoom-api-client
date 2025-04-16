import {
    ZoomApi$Meetings$Create$Request,
    ZoomApi$Meetings$Create$Response,
    ZoomApi$Meetings$Get,
    ZoomApi$Meetings$List,
    ZoomApi$Meetings$Recordings,
    ZoomApi$Meetings$Update$Request,
    ZoomApi$Meetings$Update$Response,
    ZoomApi$PastMeeting$Details,
    ZoomApi$PastMeeting$Participants,
    ZoomApi$Reports$Meetings,
    ZoomApi$Users$$Status,
    ZoomApi$Users$Get,
    ZoomApi$Users$List,
    ZoomApi$ZAKToken,
    ZoomError,
    ZoomTokens,
} from './types';
import { ZoomClient } from './zoomClient';

export class ZoomApi {
    private client: ZoomClient;
    tokens: Partial<ZoomTokens>;

    constructor(options: { client: ZoomClient; tokens: Partial<ZoomTokens> }) {
        this.client = options.client;
        this.tokens = options.tokens || {};
    }

    setTokens(tokens: Partial<ZoomTokens>) {
        this.tokens = tokens;
    }

    getZAKToken(userId: string): Promise<ZoomApi$ZAKToken> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return this.client.request({
            url: `${self.client.BASE_API_URL}/users/${userId}/token?type=zak`,
            method: 'GET',
            headers: self.getAuthHeader(),
        }) as any;
    }

    private getAuthHeader() {
        if (this.tokens?.access_token) {
            return {
                Authorization: `Bearer ${this.tokens.access_token}`,
            };
        }
        throw new ZoomError('access_token not found');
    }

    /** From: https://marketplace.zoom.us/docs/guides/auth/oauth/#using-an-access-token */
    me(): Promise<ZoomApi$Users$Get> {
        return this.users().get('me');
    }

    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users */
    users() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            list(
                params?: Partial<{
                    /**
                     * Default: 'active'
                     */
                    status: ZoomApi$Users$$Status;
                    page_size: number;
                    role_id: string;
                    page_number: string;
                    include_fields: 'custom_attributes';
                    next_page_token: string;
                }>,
            ): Promise<ZoomApi$Users$List> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                    params: {
                        page_size: 30,
                        status: 'active',
                        ...params,
                    },
                }) as any;
            },
            /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/user */
            get(
                /**
                 * The user ID or email address of the user. For user-level apps, pass the `me` value.
                 */
                userId: string,
            ): Promise<ZoomApi$Users$Get> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                }) as any;
            },
        };
    }


    /** From: https://developers.zoom.us/docs/api/accounts/ */
    accounts() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            settings(
                accountId: string,
            ): Promise<ZoomApi$Users$Get> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/accounts/${accountId}/settings`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                }) as any;
            },
        };
    }

    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/pastMeetingParticipants */
    pastMeeting(meetingId: string) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            details(): Promise<ZoomApi$PastMeeting$Details> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/past_meetings/${meetingId}`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                }) as any;
            },
            participants(
                params?: Partial<{
                    page_size: number;
                    next_page_token: string;
                }>,
            ): Promise<ZoomApi$PastMeeting$Participants> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/past_meetings/${meetingId}/participants`,
                    method: 'GET',
                    headers: self.getAuthHeader(),
                    params: {
                        page_size: 30, // Default. Max=300
                        ...params,
                    },
                }) as any;
            },
        };
    }

    reports() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportMeetings */
            meetings(
                userId: string,
                params: {
                    /**
                     * In `yyyy-mm-dd` format
                     */
                    from: string;
                    /**
                     * In `yyyy-mm-dd` format
                     */
                    to: string;
                    page_size?: number;
                    next_page_token?: string;
                    /**
                     * Default: 'past'
                     *
                     * The meeting type to query for:
                     *
                     * `past` — All past meetings.
                     *
                     * `pastOne` — A single past user meeting.
                     *
                     * `pastJoined` — All past meetings the account's users hosted or joined.
                     */
                    type?: 'past' | 'pastOne' | 'pastJoined';
                },
            ): Promise<ZoomApi$Reports$Meetings> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/report/users/${userId}/meetings`,
                    method: 'GET',
                    params: {
                        page_size: 30,
                        type: 'past',
                        ...params,
                    },
                    headers: self.getAuthHeader(),
                }) as any;
            },
        };
    }

    meetings() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        return {
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings */
            create(
                userId: string,
                meeting: ZoomApi$Meetings$Create$Request,
            ): Promise<ZoomApi$Meetings$Create$Response> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}/meetings`,
                    method: 'POST',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(meeting),
                }) as any;
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/PATCH/meetings/{meetingId} */
            update(
                meetingId: string,
                params?: ZoomApi$Meetings$Update$Request,
            ): Promise<ZoomApi$Meetings$Update$Response> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}`,
                    method: 'PATCH',
                    headers: {
                        ...self.getAuthHeader(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params),
                }) as any;
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/users/{userId}/meetings */
            list(
                userId: string,
                params?: Partial<{
                    type:
                        | 'scheduled'
                        | 'live'
                        | 'upcoming'
                        | 'upcoming_meetings'
                        | 'previous_meetings';
                    page_size: number;
                    next_page_token: number;
                    page_number: number;
                }>,
            ): Promise<ZoomApi$Meetings$List> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/users/${userId}/meetings`,
                    method: 'GET',
                    params: {
                        page_size: 30,
                        type: 'live',
                        ...params,
                    },
                    headers: self.getAuthHeader(),
                }) as any;
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/meetings/{meetingId} */
            get(
                meetingId: string,
                params?: Partial<{
                    occurence_id: string;
                    show_previous_occurences: string;
                }>,
            ): Promise<ZoomApi$Meetings$Get> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}`,
                    method: 'GET',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                }) as any;
            },
            /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/GET/meetings/{meetingId}/recordings */
            recordings(
                meetingId: string,
                params?: Partial<{
                    include_fields: string;
                    ttl: number;
                }>,
            ): Promise<ZoomApi$Meetings$Recordings> {
                return self.client.request({
                    url: `${self.client.BASE_API_URL}/meetings/${meetingId}/recordings`,
                    method: 'GET',
                    params: { ...params },
                    headers: self.getAuthHeader(),
                }) as any;
            },
            /**
             * A quick way to get the transcript of a meeting.
             */
            transcript(url: string): Promise<string> {
                return self.client.request(
                    {
                        url,
                        method: 'GET',
                        headers: self.getAuthHeader(),
                    },
                    { requestTimeoutMs: 60000 },
                ) as any;
            },
        };
    }
}
