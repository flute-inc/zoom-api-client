import { ZoomApi$Meetings$Create$Request, ZoomApi$Meetings$Create$Response, ZoomApi$Meetings$Get, ZoomApi$Meetings$List, ZoomApi$Meetings$Recordings, ZoomApi$PastMeeting$Details, ZoomApi$PastMeeting$Participants, ZoomApi$Reports$Meetings, ZoomApi$Users$$Status, ZoomApi$Users$Get, ZoomApi$Users$List, ZoomApi$ZAKToken, ZoomTokens } from './types';
import { ZoomClient } from './zoomClient';
export declare class ZoomApi {
    private client;
    tokens: Partial<ZoomTokens>;
    constructor(options: {
        client: ZoomClient;
        tokens: Partial<ZoomTokens>;
    });
    setTokens(tokens: Partial<ZoomTokens>): void;
    getZAKToken(userId: string): Promise<ZoomApi$ZAKToken>;
    private getAuthHeader;
    /** From: https://marketplace.zoom.us/docs/guides/auth/oauth/#using-an-access-token */
    me(): Promise<ZoomApi$Users$Get>;
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users */
    users(): {
        list(params?: Partial<{
            /**
             * Default: 'active'
             */
            status: ZoomApi$Users$$Status;
            page_size: number;
            role_id: string;
            page_number: string;
            include_fields: "custom_attributes";
            next_page_token: string;
        }>): Promise<ZoomApi$Users$List>;
        /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/user */
        get(userId: string): Promise<ZoomApi$Users$Get>;
    };
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/pastMeetingParticipants */
    pastMeeting(meetingId: string): {
        details(): Promise<ZoomApi$PastMeeting$Details>;
        participants(params?: Partial<{
            page_size: number;
            next_page_token: string;
        }>): Promise<ZoomApi$PastMeeting$Participants>;
    };
    reports(): {
        /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/reportMeetings */
        meetings(userId: string, params: {
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
            type?: "past" | "pastOne" | "pastJoined";
        }): Promise<ZoomApi$Reports$Meetings>;
    };
    meetings(): {
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/POST/users/{userId}/meetings */
        create(userId: string, meeting: ZoomApi$Meetings$Create$Request): Promise<ZoomApi$Meetings$Create$Response>;
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/users/{userId}/meetings */
        list(userId: string, params?: Partial<{
            type: "scheduled" | "live" | "upcoming" | "upcoming_meetings" | "previous_meetings";
            page_size: number;
            next_page_token: number;
            page_number: number;
        }>): Promise<ZoomApi$Meetings$List>;
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/GET/meetings/{meetingId} */
        get(meetingId: string, params?: Partial<{
            occurence_id: string;
            show_previous_occurences: string;
        }>): Promise<ZoomApi$Meetings$Get>;
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/GET/meetings/{meetingId}/recordings */
        recordings(meetingId: string, params?: Partial<{
            include_fields: string;
            ttl: number;
        }>): Promise<ZoomApi$Meetings$Recordings>;
        /**
         * A quick way to get the transcript of a meeting.
         */
        transcript(url: string): Promise<string>;
    };
}
