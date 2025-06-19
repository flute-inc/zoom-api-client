export declare class ZoomError extends Error {
    constructor(msg: any);
}
export type ZoomClientOptions = {
    clientId: string;
    clientSecret: string;
    accountId?: string;
    redirectUri?: string;
    verificationKey?: string;
};
export type ZoomRequest = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    params?: Record<string, any>;
    body?: RequestInit['body'];
    headers?: Record<string, string>;
};
export type ZoomRequestOptions = {
    /**
     * Default: 5000
     */
    requestTimeoutMs?: number;
} & Record<string, any>;
export type ZoomResponse = Record<string, any> | string | null;
export type ZoomSuccess = {
    success: boolean;
};
export type ZoomTokensResponse$Success = {
    access_token: string;
    token_type: 'bearer';
    refresh_token?: string;
    expires_in: number;
    scope: string;
};
export type ZoomTokensResponse$Failure = {
    error: string;
    reason: string;
};
export type ZoomTokensResponse = ZoomTokensResponse$Success | ZoomTokensResponse$Failure;
export type ZoomTokens = Partial<ZoomTokensResponse$Success> & Required<Pick<ZoomTokensResponse$Success, 'access_token' | 'refresh_token'>>;
export type ZoomApi$ZAKToken = {
    token: string;
};
export type ZoomApi$Groups$List = {
    /**
     * A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.
     */
    next_page_token: string;
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
    groups: ZoomApi$Groups$List$$Group[];
};
export type ZoomApi$Groups$List$$Group = {
    /**
     * Group ID.
     */
    id: string;
    /**
     * Group name.
     */
    name: string;
    /**
     * Total number of members in this group.
     */
    total_members?: number;
};
export type ZoomApi$Groups$Get = {
    /**
     * Group ID.
     */
    id: string;
    /**
     * Group name.
     */
    name: string;
    /**
     * Total number of members in this group.
     */
    total_members?: number;
};
export type ZoomApi$Groups$AddMembers$Request = {
    /**
     * List of Group members.
     */
    members: {
        /**
         * User email.
         */
        email: string;
        /**
         * User ID.
         */
        id?: string;
    }[];
};
export type ZoomApi$Groups$AddMembers$Response = {
    /**
     * List of members that were added to the group.
     */
    added_members: {
        /**
         * User email.
         */
        email: string;
        /**
         * User ID.
         */
        id: string;
    }[];
    /**
     * List of members that were not added to the group.
     */
    not_added_members?: {
        /**
         * User email.
         */
        email: string;
        /**
         * User ID.
         */
        id?: string;
    }[];
};
export type ZoomApi$Users$$Status = 'pending' | 'active' | 'inactive';
export type ZoomApi$Users$Create$Action = 'create' | 'autoCreate' | 'custCreate' | 'ssoCreate';
export type ZoomApi$Users$Create$UserInfo = {
    email: string;
    first_name?: string;
    last_name?: string;
    display_name?: string;
    password?: string;
    type: 1 | 2 | 4 | 99;
};
export type ZoomApi$Users$List = {
    /**
     * A next page token will be returned whenever the set of available results exceeds the current page size. The expiration period for this token is 15 minutes.
     */
    next_page_token: string;
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
    users: ZoomApi$Users$List$$User[];
};
export type ZoomApi$Users$Get = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    type: 2;
    role_name: string;
    pmi: 1234567890;
    use_pmi: false;
    vanity_url: string;
    personal_meeting_url: string;
    timezone: string;
    verified: 1;
    dept: string;
    created_at: string;
    last_login_time: string;
    last_client_version: string;
    pic_url: string;
    host_key: string;
    jid: string;
    group_ids: string[];
    im_group_ids: string[];
    account_id: string;
    language: string;
    phone_country: string;
    phone_number: string;
    status: ZoomApi$Users$$Status;
};
export type ZoomApi$Users$List$$User = {
    /**
     * The time at which the user's account was created.
     */
    created_at: string;
    /**
     * This field is only returned if users are assigned custom attributes and you provided the custom_attributes value for the include_fields query parameter in the API request.
     */
    custom_attributes: {
        key: string;
        name: string;
        value: string;
    }[];
    dept: string;
    email: string;
    employee_unique_id?: string;
    first_name: string;
    group_ids: string[];
    /**
     * The user's ID.
     * The API does not return this value for users with the pending status.
     */
    id: string;
    im_group_ids: string[];
    last_client_version: string;
    /**
     * The user's last login time. This field has a three-day buffer period.
     * For example, if user first logged in on 2020-01-01 and then logged out and logged in on 2020-01-02, this value will still reflect the login time of 2020-01-01. However, if the user logs in on 2020-01-04, the value of this field will reflect the corresponding login time since it exceeds the three-day buffer period.
     */
    last_login_time: string;
    last_name: string;
    /**
     * This field is returned if the user is enrolled in the Zoom United plan. The license option:
     */
    plan_united_type?: 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384 | 32768 | 65536 | 131072;
    pmi: number;
    role_id: string;
    status: ZoomApi$Users$$Status;
    timezone: string;
    /**
     * 1 — Basic.
     * 2 — Licensed.
     * 3 — On-prem.
     * 99 — None
     */
    type: number;
    /**
     * 1 — A verified user email.
     * 0 — The user's email not verified.
     */
    verified: number;
};
export type ZoomApi$Users$Create$User = {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    type: 1 | 2 | 4 | 99;
};
export type ZoomApi$PastMeeting$Participants$$Participant = {
    id: string;
    name: string;
    user_email?: string;
};
export type ZoomApi$PastMeeting$Participants = {
    next_page_token: string;
    page_count: number;
    page_size: number;
    total_records: number;
    participants: ZoomApi$PastMeeting$Participants$$Participant[];
};
export type ZoomApi$Meetings$List$$Meeting = {
    agenda: string;
    created_at: string;
    duration: number;
    host_id: string;
    id: number;
    join_url: string;
    pmi: string;
    start_time: string;
    timezone: string;
    topic: string;
    type: number;
    uuid: string;
};
export type ZoomApi$Meetings$List = {
    next_page_token: string;
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
    meetings: ZoomApi$Meetings$List$$Meeting[];
};
export type ZoomApi$Meetings$Get = {
    assistant_id: string;
    host_email: string;
    host_id: string;
    id: number;
    uuid: string;
    agenda: string;
    created_at: string;
    duration: number;
    encrypted_password: string;
    h323_password: string;
    join_url: string;
    occurrences: {
        duration: number;
        occurrence_id: string;
        start_time: string;
        status: string;
    }[];
    password: string;
    pmi?: string;
    pre_schedule: boolean;
    recurrence: ZoomApi$Meetings$$Recurrence;
    settings: ZoomApi$Meetings$$Settings;
    start_time: string;
    start_url: string;
    status: 'waiting' | 'started';
    timezone: string;
    topic: string;
    tracking_fields: {
        field: string;
        value: string;
        visible: boolean;
    }[];
    /**
     * Default: 2
     * Meeting Types:
     * 1 - Instant meeting.
     * 2 - Scheduled meeting.
     * 3 - Recurring meeting with no fixed time.
     * 4 - PMI Meeting
     * 8 - Recurring meeting with a fixed time.
     */
    type: 1 | 2 | 3 | 8;
};
export type ZoomApi$Meetings$Recordings = {
    account_id: string;
    duration: number;
    host_id: string;
    id: number;
    recording_count: number;
    start_time: string;
    topic: string;
    total_size: number;
    type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 99;
    uuid: string;
    recording_play_passcode: string;
    recording_files: {
        deleted_time: string;
        download_url: string;
        file_path: string;
        file_size: number;
        file_type: 'MP4' | 'M4A' | 'CHAT' | 'TRANSCRIPT' | 'CSV' | 'TB' | 'CC' | 'CHAT_MESSAGE' | 'SUMMARY';
        file_extension: 'MP4' | 'M4A' | 'TXT' | 'VTT' | 'CSV' | 'JSON' | 'JPG';
        id: string;
        meeting_id: string;
        play_url: string;
        recording_end: string;
        recording_start: string;
        recording_type: 'shared_screen_with_speaker_view(CC)' | 'shared_screen_with_speaker_view' | 'shared_screen_with_gallery_view' | 'active_speaker' | 'gallery_view' | 'shared_screen' | 'audio_only' | 'audio_transcript' | 'chat_file' | 'poll' | 'host_video' | 'closed_caption' | 'timeline' | 'thumbnail' | 'audio_interpretation' | 'summary' | 'summary_next_steps' | 'summary_smart_chapters' | 'sign_interpretation' | 'production_studio';
        status: string;
    }[];
    download_access_token: string;
    password: string;
    participant_audio_files: {
        download_url: string;
        file_name: string;
        file_path: string;
        file_size: string;
        file_type: string;
        id: string;
        play_url: string;
        recording_end: string;
        recording_start: string;
        status: string;
    }[];
};
export type ZoomApi$PastMeeting$Details = {
    id: number;
    uuid: string;
    duration: number;
    start_time: string;
    end_time: string;
    host_id: string;
    dept: string;
    participants_count: number;
    source: string;
    topic: string;
    total_minutes: number;
    type: number;
    user_email: string;
    user_name: string;
};
export type ZoomApi$Reports$Meetings = {
    next_page_token: string;
    page_count: number;
    page_size: number;
    total_records: number;
    from: string;
    meetings: ZoomApi$Reports$Meetings$$Meeting[];
    to: string;
};
export type ZoomApi$Reports$Meetings$$Meeting = {
    custom_keys: {
        key: string;
        value: string;
    }[];
    duration: number;
    /**
     * date and time
     */
    end_time: string;
    id: number;
    participants_count: number;
    session_key: string;
    source: string;
    start_time: string;
    topic: string;
    total_minutes: number;
    /**
     * The meeting type:
     *
     * 1 — An instant meeting.
     * 2 — A scheduled meeting.
     * 3 — A recurring meeting with no fixed time.
     * 4 — A personal meeting room.
     * 8 — A recurring meeting with a fixed time.
     */
    type: number;
    user_email: string;
    user_name: string;
    uuid: string;
    schedule_time: string;
    join_waiting_room_time: string;
    join_time: string;
    leave_time: string;
};
export type ZoomApi$Meetings$$Settings = {
    allow_multiple_devices: boolean;
    alternative_hosts: string;
    alternative_hosts_email_notification: boolean;
    alternative_host_update_polls: boolean;
    approval_type: number;
    approved_or_denied_countries_or_regions: {
        approved_list: string[];
        denied_list: string[];
        enable: boolean;
        method: 'approve' | 'deny';
    };
    audio: 'both' | 'telephony' | 'voip' | 'thirdParty';
    authentication_domains: string;
    authentication_exception: {
        email: string;
        name: string;
    }[];
    authentication_option: string;
    auto_recording: 'local' | 'cloud' | 'none';
    breakout_room: {
        enable: boolean;
        rooms: {
            name: string;
            participants: string[];
        }[];
    };
    calendar_type: 1 | 2;
    close_registration: boolean;
    cn_meeting: boolean;
    contact_email: string;
    contact_name: string;
    custom_keys: {
        key: string;
        value: string;
    }[];
    email_notification: boolean;
    encryption_type: 'enhanced_encryption' | 'e2ee';
    focus_mode: boolean;
    global_dial_in_countries: string[];
    host_video: boolean;
    /**
     * @deprecated
     */
    in_meeting: false;
    jbh_time: 0 | 5 | 10 | 15;
    join_before_host: boolean;
    language_interpretation: {
        enable: boolean;
        interpreters: {
            email: string;
            languages: string;
        }[];
    };
    meeting_authentication: boolean;
    mute_upon_entry: boolean;
    participant_video: boolean;
    private_meeting: boolean;
    registrants_confirmation_email: boolean;
    registrants_email_notification: boolean;
    registration_type: 1 | 2 | 3;
    show_share_button: boolean;
    use_pmi: boolean;
    waiting_room: boolean;
    watermark: boolean;
    host_save_video_order: boolean;
};
export type ZoomApi$Meetings$$Recurrence = Partial<{
    /**
     * Select the final date when the meeting will recur before it is canceled.
     * Should be in UTC time, such as 2017-11-25T12:00:00Z.
     * Cannot be used with `end_times`.
     */
    end_date_time: string;
    /**
     * Select how many times the meeting should recur before it is canceled.
     * If end_times is set to 0, it means there is no end time.
     * The maximum number of recurring is 60. Cannot be used with `end_date_time`.
     */
    end_times: number;
    /**
     * Use this field only if you're scheduling a recurring meeting of type 3
     * to state the day in a month when the meeting should recur.
     * The value range is from 1 to 31.
     */
    monthly_day: number;
    /**
     * Use this field only if you're scheduling a recurring meeting of type 3
     * to state the week of the month when the meeting should recur.
     * If you use this field, you must also use the `monthly_week_day` field
     * to state the day of the week when the meeting should recur.
     * -1 - last week
     * 1 -first week
     * 2 -second week
     * 3 -third week
     * 4 - fourth week
     */
    monthly_week: number;
    /**
     * Use this field only if you're scheduling a recurring meeting of type 3
     * to state a specific day in a week when the monthly meeting should recur.
     * To use this field, you must also use the `monthly_week` field.
     * 1 - Sunday
     * 2 - Monday
     * 3 - Tuesday
     * 4 - Wednesday
     * 5 - Thursday
     * 6 - Friday
     * 7 - Saturday
     */
    monthly_week_day: number;
    /**
     * Define the interval when the meeting should recur.
     * For instance, to schedule a meeting that recurs every two months,
     * set this field's value as 2 and the value of the type parameter as 3.
     */
    repeat_interval: number;
    /**
     * This field is required if you're scheduling a recurring meeting of type 2
     * to state the days of the week when the meeting should repeat.
     * To set the meeting to occur on multiple days of a week, provide comma
     * separated values for this field. For instance, if the meeting should
     * recur on Sundays and Tuesdays, provide `1,3` as this field's value.
     */
    weekly_days: string;
}> & {
    /**
     * Recurrence meeting types.
     * 1 - Daily.
     * 2 - Weekly.
     * 3 - Monthly.
     */
    type: number;
};
export type ZoomApi$Meetings$Create$Request = Partial<{
    /**
     * The meeting's agenda.
     * This value has a maximum length of 2,000 characters.
     */
    agenda: string;
    /**
     * Whether to generate a default passcode using the user's settings.
     * @default false
     */
    default_password: boolean;
    /**
     * The meeting's scheduled duration in minutes.
     * This field is only used for scheduled meetings (2).
     */
    duration: number;
    /**
     * The passcode required to join the meeting.
     * By default, a passcode can only have a maximum length of 10 characters
     * and only contain alphanumeric characters and the @, -, _, and * characters.
     */
    password: string;
    /**
     * Whether to create a prescheduled meeting via the GSuite app.
     * This only supports the meeting type value of 2 (scheduled meetings)
     * and 3 (recurring meetings with no fixed time).
     */
    pre_schedule: boolean;
    /**
     * The email address or user ID of the user to schedule a meeting for.
     */
    schedule_for: string;
    /**
     * The meeting's recurrence information.
     * Use this object only for a meeting with type 8, a recurring meeting with a fixed time.
     */
    recurrence: ZoomApi$Meetings$$Recurrence;
    /**
     * Information about the meeting's settings.
     */
    settings: ZoomApi$Meetings$$Settings;
    /**
     * The meeting's start time.
     * This field is only used for scheduled or recurring meetings with a fixed time.
     * This supports local time and GMT formats.
     */
    start_time: string;
    /**
     * The account admin meeting template ID used to schedule a meeting using a meeting template.
     */
    template_id: string;
    /**
     * The timezone to assign to the start_time value.
     * This field is only used for scheduled or recurring meetings with a fixed time.
     */
    timezone: string;
    /**
     * The meeting's topic.
     */
    topic: string;
    /**
     * Information about the meeting's tracking fields.
     */
    tracking_fields: {
        field: string;
        value: string;
    }[];
}> & {
    /**
     * The meeting type.
     * 1 - Instant meeting.
     * 2 - Scheduled meeting. Default.
     * 3 - Recurring meeting with no fixed time.
     * 8 - Recurring meeting with a fixed time.
     * 10 - A screen share only meeting.
     */
    type: number;
};
export type ZoomApi$Meetings$Create$Response = Partial<{
    assistant_id: string;
    host_email: string;
    id: number;
    uuid: string;
    agenda: string;
    created_at: string;
    duration: number;
    encrypted_password: string;
    pstn_password: string;
    h323_password: string;
    join_url: string;
    chat_join_url: string;
    occurrences: {
        duration: number;
        occurrence_id: string;
        start_time: string;
        status: 'available' | 'deleted';
    }[];
    password: string;
    pmi: string;
    pre_schedule: boolean;
    recurrence: ZoomApi$Meetings$$Recurrence;
    settings: ZoomApi$Meetings$$Settings;
    start_time: string;
    start_url: string;
    timezone: string;
    topic: string;
    tracking_fields: {
        field: string;
        value: string;
        visible: boolean;
    }[];
    type: 1 | 2 | 3 | 8;
    dynamic_host_key: string;
    creation_source: 'other' | 'open_api' | 'web_portal';
}>;
export type ZoomApi$Meetings$Update$Request = Partial<{
    /**
     * The meeting's agenda.
     * This value has a maximum length of 2,000 characters.
     */
    agenda: string;
    /**
     * The meeting's scheduled duration in minutes.
     * This field is only used for scheduled meetings (2).
     */
    duration: number;
    /**
     * The passcode required to join the meeting.
     * By default, a passcode can only have a maximum length of 10 characters
     * and only contain alphanumeric characters and the @, -, _, and * characters.
     */
    password: string;
    /**
     * Whether to create a prescheduled meeting via the GSuite app.
     * This only supports the meeting type value of 2 (scheduled meetings)
     * and 3 (recurring meetings with no fixed time).
     */
    pre_schedule: boolean;
    /**
     * The meeting's recurrence information.
     * Use this object only for a meeting with type 8, a recurring meeting with a fixed time.
     */
    recurrence: ZoomApi$Meetings$$Recurrence;
    /**
     * The email address or user ID of the user to schedule a meeting for.
     */
    schedule_for: string;
    /**
     * Information about the meeting's settings.
     */
    settings: ZoomApi$Meetings$$Settings;
    /**
     * The meeting's start time.
     * This field is only used for scheduled or recurring meetings with a fixed time.
     * This supports local time and GMT formats.
     */
    start_time: string;
    /**
     * The account admin meeting template ID used to schedule a meeting using a meeting template.
     */
    template_id: string;
    /**
     * The timezone to assign to the start_time value.
     * This field is only used for scheduled or recurring meetings with a fixed time.
     */
    timezone: string;
    /**
     * The meeting's topic.
     */
    topic: string;
    /**
     * Information about the meeting's tracking fields.
     */
    tracking_fields: {
        field: string;
        value: string;
    }[];
    /**
     * The meeting type.
     * 1 - Instant meeting.
     * 2 - Scheduled meeting. Default.
     * 3 - Recurring meeting with no fixed time.
     * 8 - Recurring meeting with a fixed time.
     * 10 - A screen share only meeting.
     */
    type: number;
}>;
export type ZoomApi$Meetings$Update$Response = Partial<{
    id: number;
    uuid: string;
    assistant_id: string;
    host_email: string;
    agenda: string;
    created_at: string;
    duration: number;
    encrypted_password: string;
    pstn_password: string;
    h323_password: string;
    join_url: string;
    chat_join_url: string;
    occurrences: {
        duration: number;
        occurrence_id: string;
        start_time: string;
        status: 'available' | 'deleted';
    }[];
    password: string;
    pmi: string;
    pre_schedule: boolean;
    recurrence: ZoomApi$Meetings$$Recurrence;
    settings: ZoomApi$Meetings$$Settings;
    start_time: string;
    start_url: string;
    timezone: string;
    topic: string;
    tracking_fields: {
        field: string;
        value: string;
        visible: boolean;
    }[];
    type: 1 | 2 | 3 | 8;
    dynamic_host_key: string;
    creation_source: 'other' | 'open_api' | 'web_portal';
}>;
export type ZoomEventBody<T> = {
    event: string;
    payload: T & {
        client_id: string;
        signature: string;
    };
};
export type ZoomEventRequest<T = Record<string, string>> = {
    body: ZoomEventBody<T>;
    headers: Record<string, string>;
};
