import { EventEmitter } from 'events';
import { ZoomRequest, ZoomClientOptions, ZoomRequestOptions, ZoomResponse } from './types';
export declare class ZoomClient {
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
    accountId?: string;
    verificationKey?: string;
    BASE_OAUTH_URL: string;
    BASE_API_URL: string;
    emitter: EventEmitter;
    constructor(options: ZoomClientOptions);
    private normalizeUrl;
    private callApi;
    constructParams(params: Record<string, any>, pathname?: string): string;
    request(request: string | ZoomRequest, options?: ZoomRequestOptions): Promise<ZoomResponse>;
}
