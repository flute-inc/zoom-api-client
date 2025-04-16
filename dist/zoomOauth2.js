"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomOauth = void 0;
const types_1 = require("./types");
class ZoomOauth {
    client;
    constructor(client) {
        this.client = client;
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth#step-1-request-user-authorization */
    getAuthorizationUrl(state) {
        return this.client.constructParams({
            response_type: 'code',
            redirect_uri: this.client.redirectUri,
            client_id: this.client.clientId,
            state,
        }, `${this.client.BASE_OAUTH_URL}/oauth/authorize`);
    }
    withAuthorizationHeaders() {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${this.client.clientId}:${this.client.clientSecret}`).toString('base64')}`,
        };
    }
    withOAuthTokenRequest(endpoint) {
        return {
            url: `${this.client.BASE_OAUTH_URL}/oauth/${endpoint}`,
            method: 'POST',
            headers: this.withAuthorizationHeaders(),
        };
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth#step-2-request-access-token */
    async requestTokens(code) {
        const body = this.client.constructParams({
            grant_type: 'authorization_code',
            redirect_uri: this.client.redirectUri,
            code,
        });
        return this.client.request({
            body,
            ...this.withOAuthTokenRequest('token'),
        });
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#refreshing-an-access-token */
    refreshTokens(refreshToken) {
        const body = this.client.constructParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
        return this.client.request({
            body,
            ...this.withOAuthTokenRequest('token'),
        });
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#revoking-an-access-token */
    revokeTokens(accessToken) {
        const body = this.client.constructParams({
            token: accessToken,
        });
        return this.client.request({
            body,
            ...this.withOAuthTokenRequest('revoke'),
        });
    }
    verifyEvent(event) {
        if (!this.client.verificationKey)
            throw new types_1.ZoomError('No verification key provided');
        const { body, headers } = event;
        const { payload } = body;
        return (headers.authorization === this.client.verificationKey &&
            payload.client_id === this.client.clientId);
    }
}
exports.ZoomOauth = ZoomOauth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbU9hdXRoMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tT2F1dGgyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQU1pQjtBQUdqQixNQUFhLFNBQVM7SUFDUixNQUFNLENBQWE7SUFFN0IsWUFBWSxNQUFrQjtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLG1CQUFtQixDQUFDLEtBQWM7UUFDOUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FDOUI7WUFDSSxhQUFhLEVBQUUsTUFBTTtZQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1lBQ3JDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFDL0IsS0FBSztTQUNSLEVBQ0QsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsa0JBQWtCLENBQ2xELENBQUM7SUFDTixDQUFDO0lBRU8sd0JBQXdCO1FBQzVCLE9BQU87WUFDSCxjQUFjLEVBQUUsbUNBQW1DO1lBQ25ELGFBQWEsRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLENBQy9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FDeEQsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7U0FDekIsQ0FBQztJQUNOLENBQUM7SUFFUyxxQkFBcUIsQ0FBQyxRQUFnQjtRQUM1QyxPQUFPO1lBQ0gsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLFVBQVUsUUFBUSxFQUFFO1lBQ3RELE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtTQUMzQyxDQUFDO0lBQ04sQ0FBQztJQUVELDBGQUEwRjtJQUMxRixLQUFLLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDckMsVUFBVSxFQUFFLG9CQUFvQjtZQUNoQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1lBQ3JDLElBQUk7U0FDUCxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLElBQUk7WUFDSixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxPQUFPLENBQUM7U0FDekMsQ0FBUSxDQUFDO0lBQ2QsQ0FBQztJQUVELDBGQUEwRjtJQUMxRixhQUFhLENBQUMsWUFBb0I7UUFDOUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7WUFDckMsVUFBVSxFQUFFLGVBQWU7WUFDM0IsYUFBYSxFQUFFLFlBQVk7U0FDOUIsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztZQUN2QixJQUFJO1lBQ0osR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1NBQ3pDLENBQVEsQ0FBQztJQUNkLENBQUM7SUFFRCx3RkFBd0Y7SUFDeEYsWUFBWSxDQUFDLFdBQW1CO1FBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDO1lBQ3JDLEtBQUssRUFBRSxXQUFXO1NBQ3JCLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDdkIsSUFBSTtZQUNKLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztTQUMxQyxDQUFRLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQXVCO1FBQy9CLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWU7WUFDNUIsTUFBTSxJQUFJLGlCQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUN4RCxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUNoQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLE9BQU8sQ0FDSCxPQUFPLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZTtZQUNyRCxPQUFPLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUM3QyxDQUFDO0lBQ04sQ0FBQztDQUNKO0FBbkZELDhCQW1GQyJ9