import { ZoomClient } from './zoomClient';
import { ZoomOauth } from './zoomOauth2';
export declare class ZoomS2SO extends ZoomOauth {
    constructor(client: ZoomClient);
    requestTokens(): ReturnType<ZoomOauth['requestTokens']>;
    getAuthorizationUrl(_?: string): ReturnType<ZoomOauth['getAuthorizationUrl']>;
    refreshTokens(_?: string): ReturnType<ZoomOauth['refreshTokens']>;
    revokeTokens(_?: string): ReturnType<ZoomOauth['revokeTokens']>;
}
