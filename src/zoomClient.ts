import { EventEmitter } from 'events';
import { URLSearchParams } from 'url';
import {
    ZoomRequest,
    ZoomClientOptions,
    ZoomRequestOptions,
    ZoomResponse,
    ZoomError,
    ZoomErrorDetails,
} from './types';

export class ZoomClient {
    clientId: string;
    clientSecret: string;
    redirectUri?: string;
    accountId?: string;
    verificationKey?: string;

    BASE_OAUTH_URL = 'https://zoom.us';
    BASE_API_URL = 'https://api.zoom.us/v2';

    emitter: EventEmitter;

    constructor(options: ZoomClientOptions) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.accountId = options.accountId;
        this.redirectUri = options.redirectUri;
        this.verificationKey = options.verificationKey;
        this.emitter = new EventEmitter();

        this.emitter.emit('connection:new', this);
    }

    private normalizeUrl(url: string) {
        if (url[0] === '/') {
            if (url.indexOf('/oauth') === 0) {
                return `${this.BASE_OAUTH_URL}${url}`;
            } else {
                if (url.indexOf('/v2') === 0) {
                    return `${this.BASE_API_URL}${url.split('/v2')[1]}`;
                }
                return `${this.BASE_API_URL}${url}`;
            }
        } else {
            return url;
        }
    }

    private async callApi(request: ZoomRequest, options: ZoomRequestOptions) {
        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            options.requestTimeoutMs || 5000,
        );

        let result: ZoomResponse = null;
        try {
            const res = await fetch(request.url, {
                method: request.method || 'GET',
                signal: controller.signal,
                body: request.body,
                headers: request.headers,
            });
            result = await res.text();

            try {
                result = JSON.parse(result);
            } catch (_) {
                // do nothing
            }

            if (!res.ok) {
                // より詳細なエラー情報を構築
                let errorMessage = 'Zoom Api Error';
                let errorDetails: ZoomErrorDetails = {
                    status: res.status,
                    statusText: res.statusText,
                    url: request.url,
                    method: request.method || 'GET'
                };

                // レスポンスボディからエラー情報を抽出
                if (typeof result === 'object' && result !== null) {
                    if (result.error) {
                        errorMessage = result.error;
                    }
                    if (result.message) {
                        errorMessage = `${errorMessage}: ${result.message}`;
                    }
                    if (result.reason) {
                        errorMessage = `${errorMessage} (${result.reason})`;
                    }
                    errorDetails.responseBody = result;
                } else if (typeof result === 'string') {
                    errorMessage = result;
                    errorDetails.responseBody = result;
                }

                throw new ZoomError(errorMessage, errorDetails);
            }
        } catch (error: any) {
            // ネットワークエラーやタイムアウトエラーの場合
            if (error.name === 'AbortError') {
                const errorDetails: ZoomErrorDetails = {
                    url: request.url,
                    method: request.method || 'GET',
                    timeout: options.requestTimeoutMs || 5000
                };
                throw new ZoomError(`Zoom API request timed out after ${options.requestTimeoutMs || 5000}ms`, errorDetails);
            }
            
            // 既に詳細情報が含まれているエラーの場合はそのまま再スロー
            if (error.details) {
                throw error;
            }
            
            // その他のエラーの場合
            const errorDetails: ZoomErrorDetails = {
                url: request.url,
                method: request.method || 'GET',
                originalError: error.message
            };
            throw new ZoomError(`Zoom API request failed: ${error.message}`, errorDetails);
        } finally {
            clearTimeout(timeout);
        }

        return result;
    }

    constructParams(params: Record<string, any>, pathname?: string) {
        const usp = new URLSearchParams(params);
        if (pathname) return `${pathname}?${usp.toString()}`;
        return usp.toString();
    }

    async request(
        request: string | ZoomRequest,
        options: ZoomRequestOptions = {},
    ) {
        let req: ZoomRequest = request as ZoomRequest;

        if (typeof request === 'string') {
            req = { method: 'GET', url: request };
        }
        req.url = this.normalizeUrl(req.url);
        if (req.params) {
            req.url = this.constructParams(req.params, req.url);
        }

        return this.callApi(req, options);
    }
}
