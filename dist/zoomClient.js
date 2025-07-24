"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomClient = void 0;
const events_1 = require("events");
const url_1 = require("url");
const types_1 = require("./types");
class ZoomClient {
    clientId;
    clientSecret;
    redirectUri;
    accountId;
    verificationKey;
    BASE_OAUTH_URL = 'https://zoom.us';
    BASE_API_URL = 'https://api.zoom.us/v2';
    emitter;
    constructor(options) {
        this.clientId = options.clientId;
        this.clientSecret = options.clientSecret;
        this.accountId = options.accountId;
        this.redirectUri = options.redirectUri;
        this.verificationKey = options.verificationKey;
        this.emitter = new events_1.EventEmitter();
        this.emitter.emit('connection:new', this);
    }
    normalizeUrl(url) {
        if (url[0] === '/') {
            if (url.indexOf('/oauth') === 0) {
                return `${this.BASE_OAUTH_URL}${url}`;
            }
            else {
                if (url.indexOf('/v2') === 0) {
                    return `${this.BASE_API_URL}${url.split('/v2')[1]}`;
                }
                return `${this.BASE_API_URL}${url}`;
            }
        }
        else {
            return url;
        }
    }
    async callApi(request, options) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), options.requestTimeoutMs || 5000);
        let result = null;
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
            }
            catch (_) {
                // do nothing
            }
            if (!res.ok) {
                // より詳細なエラー情報を構築
                let errorMessage = 'Zoom Api Error';
                let errorDetails = {
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
                }
                else if (typeof result === 'string') {
                    errorMessage = result;
                    errorDetails.responseBody = result;
                }
                throw new types_1.ZoomError(errorMessage, errorDetails);
            }
        }
        catch (error) {
            // ネットワークエラーやタイムアウトエラーの場合
            if (error.name === 'AbortError') {
                const errorDetails = {
                    url: request.url,
                    method: request.method || 'GET',
                    timeout: options.requestTimeoutMs || 5000
                };
                throw new types_1.ZoomError(`Zoom API request timed out after ${options.requestTimeoutMs || 5000}ms`, errorDetails);
            }
            // 既に詳細情報が含まれているエラーの場合はそのまま再スロー
            if (error.details) {
                throw error;
            }
            // その他のエラーの場合
            const errorDetails = {
                url: request.url,
                method: request.method || 'GET',
                originalError: error.message
            };
            throw new types_1.ZoomError(`Zoom API request failed: ${error.message}`, errorDetails);
        }
        finally {
            clearTimeout(timeout);
        }
        return result;
    }
    constructParams(params, pathname) {
        const usp = new url_1.URLSearchParams(params);
        if (pathname)
            return `${pathname}?${usp.toString()}`;
        return usp.toString();
    }
    async request(request, options = {}) {
        let req = request;
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
exports.ZoomClient = ZoomClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFzQztBQUN0Qyw2QkFBc0M7QUFDdEMsbUNBT2lCO0FBRWpCLE1BQWEsVUFBVTtJQUNuQixRQUFRLENBQVM7SUFDakIsWUFBWSxDQUFTO0lBQ3JCLFdBQVcsQ0FBVTtJQUNyQixTQUFTLENBQVU7SUFDbkIsZUFBZSxDQUFVO0lBRXpCLGNBQWMsR0FBRyxpQkFBaUIsQ0FBQztJQUNuQyxZQUFZLEdBQUcsd0JBQXdCLENBQUM7SUFFeEMsT0FBTyxDQUFlO0lBRXRCLFlBQVksT0FBMEI7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQztRQUN6QyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQztRQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUkscUJBQVksRUFBRSxDQUFDO1FBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTyxZQUFZLENBQUMsR0FBVztRQUM1QixJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQzlCLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQzFDLENBQUM7aUJBQU0sQ0FBQztnQkFDSixJ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