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
        try {
            const body = this.client.constructParams({
                grant_type: 'authorization_code',
                redirect_uri: this.client.redirectUri,
                code,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('token'),
            });
        }
        catch (error) {
            // エラーにコンテキスト情報を追加
            if (error instanceof types_1.ZoomError) {
                const enhancedError = new types_1.ZoomError(`Failed to request Zoom tokens: ${error.message}`, {
                    ...error.details,
                    code: code ? `${code.substring(0, 10)}...` : 'undefined',
                    operation: 'request_tokens'
                });
                throw enhancedError;
            }
            throw error;
        }
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#refreshing-an-access-token */
    async refreshTokens(refreshToken) {
        try {
            const body = this.client.constructParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('token'),
            });
        }
        catch (error) {
            // エラーにコンテキスト情報を追加
            if (error instanceof types_1.ZoomError) {
                const enhancedError = new types_1.ZoomError(`Failed to refresh Zoom tokens: ${error.message}`, {
                    ...error.details,
                    refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : 'undefined',
                    operation: 'refresh_tokens'
                });
                throw enhancedError;
            }
            throw error;
        }
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#revoking-an-access-token */
    async revokeTokens(accessToken) {
        try {
            const body = this.client.constructParams({
                token: accessToken,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('revoke'),
            });
        }
        catch (error) {
            // エラーにコンテキスト情報を追加
            if (error instanceof types_1.ZoomError) {
                const enhancedError = new types_1.ZoomError(`Failed to revoke Zoom tokens: ${error.message}`, {
                    ...error.details,
                    accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined',
                    operation: 'revoke_tokens'
                });
                throw enhancedError;
            }
            throw error;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbU9hdXRoMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tT2F1dGgyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQU1pQjtBQUdqQixNQUFhLFNBQVM7SUFDUixNQUFNLENBQWE7SUFFN0IsWUFBWSxNQUFrQjtRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN6QixDQUFDO0lBRUQsZ0dBQWdHO0lBQ2hHLG1CQUFtQixDQUFDLEtBQWM7UUFDOUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FDOUI7WUFDSSxhQUFhLEVBQUUsTUFBTTtZQUNyQixZQUFZLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXO1lBQ3JDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVE7WUFDL0IsS0FBSztTQUNSLEVBQ0QsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsa0JBQWtCLENBQ2xELENBQUM7SUFDTixDQUFDO0lBRU8sd0JBQXdCO1FBQzVCLE9BQU87WUFDSCxjQUFjLEVBQUUsbUNBQW1DO1lBQ25ELGFBQWEsRUFBRSxTQUFTLE1BQU0sQ0FBQyxJQUFJLENBQy9CLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FDeEQsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7U0FDekIsQ0FBQztJQUNOLENBQUM7SUFFUyxxQkFBcUIsQ0FBQyxRQUFnQjtRQUM1QyxPQUFPO1lBQ0gsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLFVBQVUsUUFBUSxFQUFFO1lBQ3RELE1BQU0sRUFBRSxNQUFNO1lBQ2QsT0FBTyxFQUFFLElBQUksQ0FBQyx3QkFBd0IsRUFBRTtTQUMzQyxDQUFDO0lBQ04sQ0FBQztJQUVELDBGQUEwRjtJQUMxRixLQUFLLENBQUMsYUFBYSxDQUFDLElB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