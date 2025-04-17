import { ZoomApi$Groups$AddMembers$Request, ZoomApi$Groups$AddMembers$Response, ZoomApi$Groups$Get, ZoomApi$Groups$List, ZoomApi$Meetings$Create$Request, ZoomApi$Meetings$Create$Response, ZoomApi$Meetings$Get, ZoomApi$Meetings$List, ZoomApi$Meetings$Recordings, ZoomApi$Meetings$Update$Request, ZoomApi$Meetings$Update$Response, ZoomApi$PastMeeting$Details, ZoomApi$PastMeeting$Participants, ZoomApi$Reports$Meetings, ZoomApi$Users$$Status, ZoomApi$Users$Create$Action, ZoomApi$Users$Create$User, ZoomApi$Users$Create$UserInfo, ZoomApi$Users$Get, ZoomApi$Users$List, ZoomApi$ZAKToken, ZoomSuccess, ZoomTokens } from './types';
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
    /** From: https://developers.zoom.us/docs/api/users/#tag/groups */
    groups(): {
        /** From: https://developers.zoom.us/docs/api/users/#tag/groups/GET/groups */
        list(params?: Partial<{
            page_size: number;
            page_number: number;
            next_page_token: string;
        }>): Promise<ZoomApi$Groups$List>;
        /** From: https://developers.zoom.us/docs/api/users/#tag/groups/GET/groups/{groupId} */
        get(groupId: string): Promise<ZoomApi$Groups$Get>;
        /** From: https://developers.zoom.us/docs/api/users/#tag/groups/POST/groups/{groupId}/members */
        addMembers(groupId: string, members: ZoomApi$Groups$AddMembers$Request): Promise<ZoomApi$Groups$AddMembers$Response>;
        /** From: https://developers.zoom.us/docs/api/users/#tag/groups/DELETE/groups/{groupId}/members/{memberId} */
        removeMember(groupId: string, memberId: string): Promise<ZoomSuccess>;
    };
    /** From: https://marketplace.zoom.us/docs/api-reference/zoom-api/methods/#operation/users */
    users(): {
        /** From: https://developers.zoom.us/docs/api/users/#tag/users/POST/users */
        create(input: {
            action: ZoomApi$Users$Create$Action;
            user_info: ZoomApi$Users$Create$UserInfo;
        }): Promise<ZoomApi$Users$Create$User>;
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
    /** From: https://developers.zoom.us/docs/api/accounts/ */
    accounts(): {
        settings(accountId: string): Promise<ZoomApi$Users$Get>;
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
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/PATCH/meetings/{meetingId} */
        update(meetingId: string, params?: ZoomApi$Meetings$Update$Request): Promise<ZoomApi$Meetings$Update$Response>;
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
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/meetings/DELETE/meetings/{meetingId} */
        delete(meetingId: string, params?: Partial<{
            /**
             * The meeting occurrence ID.
             */
            occurrence_id: string;
            /**
             * Whether to send cancellation email to registrants.
             * Default: false
             */
            schedule_for_reminder: boolean;
        }>): Promise<ZoomSuccess>;
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/DELETE/meetings/{meetingId}/recordings/{recordingId} */
        deleteRecording(meetingId: string, recordingId: string, params?: Partial<{
            /**
             * The recording delete action.
             * `trash` - Move recording to trash.
             * `delete` - Delete recording permanently.
             */
            action: "trash" | "delete";
        }>): Promise<ZoomSuccess>;
        /** From: https://developers.zoom.us/docs/api/meetings/#tag/cloud-recording/DELETE/meetings/{meetingId}/recordings */
        deleteAllRecordings(meetingId: string, params?: Partial<{
            /**
             * The recording delete action.
             * `trash` - Move recording to trash.
             * `delete` - Delete recording permanently.
             */
            action: "trash" | "delete";
        }>): Promise<ZoomSuccess>;
    };
}
