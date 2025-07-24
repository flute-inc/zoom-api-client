import {
    ZoomError,
    ZoomEventRequest,
    ZoomRequest,
    ZoomSuccess,
    ZoomTokensResponse,
} from './types';
import { ZoomClient } from './zoomClient';

export class ZoomOauth {
    protected client: ZoomClient;

    constructor(client: ZoomClient) {
        this.client = client;
    }

    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth#step-1-request-user-authorization */
    getAuthorizationUrl(state?: string) {
        return this.client.constructParams(
            {
                response_type: 'code',
                redirect_uri: this.client.redirectUri,
                client_id: this.client.clientId,
                state,
            },
            `${this.client.BASE_OAUTH_URL}/oauth/authorize`,
        );
    }

    private withAuthorizationHeaders() {
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${this.client.clientId}:${this.client.clientSecret}`,
            ).toString('base64')}`,
        };
    }

    protected withOAuthTokenRequest(endpoint: string): ZoomRequest {
        return {
            url: `${this.client.BASE_OAUTH_URL}/oauth/${endpoint}`,
            method: 'POST',
            headers: this.withAuthorizationHeaders(),
        };
    }

    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth#step-2-request-access-token */
    async requestTokens(code: string): Promise<ZoomTokensResponse> {
        try {
            const body = this.client.constructParams({
                grant_type: 'authorization_code',
                redirect_uri: this.client.redirectUri,
                code,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('token'),
            }) as any;
        } catch (error: any) {
            // エラーにコンテキスト情報を追加
            if (error instanceof ZoomError) {
                const enhancedError = new ZoomError(
                    `Failed to request Zoom tokens: ${error.message}`,
                    {
                        ...error.details,
                        code: code ? `${code.substring(0, 10)}...` : 'undefined',
                        operation: 'request_tokens'
                    }
                );
                throw enhancedError;
            }
            throw error;
        }
    }

    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#refreshing-an-access-token */
    async refreshTokens(refreshToken: string): Promise<ZoomTokensResponse> {
        try {
            const body = this.client.constructParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('token'),
            }) as any;
        } catch (error: any) {
            // エラーにコンテキスト情報を追加
            if (error instanceof ZoomError) {
                const enhancedError = new ZoomError(
                    `Failed to refresh Zoom tokens: ${error.message}`,
                    {
                        ...error.details,
                        refreshToken: refreshToken ? `${refreshToken.substring(0, 10)}...` : 'undefined',
                        operation: 'refresh_tokens'
                    }
                );
                throw enhancedError;
            }
            throw error;
        }
    }

    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#revoking-an-access-token */
    async revokeTokens(accessToken: string): Promise<ZoomSuccess> {
        try {
            const body = this.client.constructParams({
                token: accessToken,
            });
            return await this.client.request({
                body,
                ...this.withOAuthTokenRequest('revoke'),
            }) as any;
        } catch (error: any) {
            // エラーにコンテキスト情報を追加
            if (error instanceof ZoomError) {
                const enhancedError = new ZoomError(
                    `Failed to revoke Zoom tokens: ${error.message}`,
                    {
                        ...error.details,
                        accessToken: accessToken ? `${accessToken.substring(0, 10)}...` : 'undefined',
                        operation: 'revoke_tokens'
                    }
                );
                throw enhancedError;
            }
            throw error;
        }
    }

    verifyEvent(event: ZoomEventRequest): boolean {
        if (!this.client.verificationKey)
            throw new ZoomError('No verification key provided');
        const { body, headers } = event;
        const { payload } = body;
        return (
            headers.authorization === this.client.verificationKey &&
            payload.client_id === this.client.clientId
        );
    }
}
