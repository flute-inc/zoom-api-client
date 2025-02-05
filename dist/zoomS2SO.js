"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomS2SO = void 0;
const zoomOauth2_1 = require("./zoomOauth2");
class ZoomS2SO extends zoomOauth2_1.ZoomOauth {
    constructor(client) {
        super(client);
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth#step-2-request-access-token */
    async requestTokens() {
        return this.client.request({
            params: {
                grant_type: 'account_credentials',
                account_id: this.client.accountId,
            },
            ...this.withOAuthTokenRequest('token'),
        });
    }
    getAuthorizationUrl(_) {
        throw new Error('Operation not allowed in S2SO');
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#refreshing-an-access-token */
    refreshTokens(_) {
        throw new Error('Operation not allowed in S2SO');
    }
    /* From: https://marketplace.zoom.us/docs/guides/auth/oauth/#revoking-an-access-token */
    revokeTokens(_) {
        throw new Error('Operation not allowed in S2SO');
    }
}
exports.ZoomS2SO = ZoomS2SO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbVMyU08uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvem9vbVMyU08udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNkNBQXlDO0FBRXpDLE1BQWEsUUFBUyxTQUFRLHNCQUFTO0lBQ25DLFlBQVksTUFBa0I7UUFDMUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCwwRkFBMEY7SUFDMUYsS0FBSyxDQUFDLGFBQWE7UUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLE1BQU0sRUFBRTtnQkFDSixVQUFVLEVBQUUscUJBQXFCO2dCQUNqQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTO2FBQ3BDO1lBQ0QsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDO1NBQ3pDLENBQVEsQ0FBQztJQUNkLENBQUM7SUFFRCxtQkFBbUIsQ0FDZixDQUFVO1FBRVYsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCwwRkFBMEY7SUFDMUYsYUFBYSxDQUFDLENBQVU7UUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCx3RkFBd0Y7SUFDeEYsWUFBWSxDQUFDLENBQVU7UUFDbkIsTUFBTSxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0lBQ3JELENBQUM7Q0FDSjtBQS9CRCw0QkErQkMifQ==