import { ZoomEventRequest, ZoomRequest, ZoomSuccess, ZoomTokensResponse } from './types';
import { ZoomClient } from './zoomClient';
export declare class ZoomOauth {
    protected client: ZoomClient;
    constructor(client: ZoomClient);
    getAuthorizationUrl(state?: string): string;
    private withAuthorizationHeaders;
    protected withOAuthTokenRequest(endpoint: string): ZoomRequest;
    requestTokens(code: string): Promise<ZoomTokensResponse>;
    refreshTokens(refreshToken: string): Promise<ZoomTokensResponse>;
    revokeTokens(accessToken: string): Promise<ZoomSuccess>;
    verifyEvent(event: ZoomEventRequest): boolean;
}
