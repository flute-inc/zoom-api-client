# Changelog

## 0.1.2

- **Enhanced Error Handling**: Improved error reporting with detailed information
  - Added `ZoomError` class with detailed error information
  - HTTP status codes, status text, request URL, and method are now included in errors
  - Response body from Zoom API is preserved in error details
  - Operation context (refresh_tokens, request_tokens, revoke_tokens) is added
  - Network timeout errors include timeout duration and request details
  - Token refresh failures include partial token information for debugging
- **Better Debugging**: More informative error messages for common scenarios
  - Token expiration errors show detailed Zoom API response
  - Authentication failures include authorization context
  - Network issues provide request details for troubleshooting

## 0.0.3

- APIs added
  - Zak Token (`zoomApi.getZAKToken()`)
- Make `tokens` property public in `ZoomApi` class

## 0.0.2

- APIs added
  - Meetings (`zoomApi.meetings()`)
    - Create (`.create()`)

## 0.0.1

- First release
- APIs added
  - Me (`zoomApi.me()`)
  - Reports (`zoomApi.reports()`)
    - Meetings (`.meetings()`)
  - Meetings (`zoomApi.meetings()`)
    - List (`.list()`)
    - Get(`.get()`)
    - Recordings (`.recordings()`)
    - Transcript (Not official API) (`.transcript()`)
  - Past Meetings (`zoomApi.pastMeetings()`)
    - Details (`.details()`)
    - Participants (`.participants()`)
  - Users (`zoomApi.users()`)
    - Get (`.get()`)
    - List (`.list()`)
