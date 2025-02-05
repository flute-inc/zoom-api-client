"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomClient = void 0;
const events_1 = require("events");
const url_1 = require("url");
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
                if (typeof result == 'string')
                    throw new Error(result);
                else
                    throw new Error(result?.message || 'Zoom Api Error');
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbUNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy96b29tQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFzQztBQUN0Qyw2QkFBc0M7QUFRdEMsTUFBYSxVQUFVO0lBQ25CLFFBQVEsQ0FBUztJQUNqQixZQUFZLENBQVM7SUFDckIsV0FBVyxDQUFVO0lBQ3JCLFNBQVMsQ0FBVTtJQUNuQixlQUFlLENBQVU7SUFFekIsY0FBYyxHQUFHLGlCQUFpQixDQUFDO0lBQ25DLFlBQVksR0FBRyx3QkFBd0IsQ0FBQztJQUV4QyxPQUFPLENBQWU7SUFFdEIsWUFBWSxPQUEwQjtRQUNsQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUM7UUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFDdkMsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDO1FBQy9DLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxxQkFBWSxFQUFFLENBQUM7UUFFbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVPLFlBQVksQ0FBQyxHQUFXO1FBQzVCLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztnQkFDOUIsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDMUMsQ0FBQztpQkFBTSxDQUFDO2dCQUNKLElBQUksR0FBRyxDQUFD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