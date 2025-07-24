"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomError = void 0;
class ZoomError extends Error {
    details;
    constructor(msg, details) {
        super(msg);
        this.name = this.constructor.name;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ZoomError = ZoomError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxTQUFVLFNBQVEsS0FBSztJQUNoQyxPQUFPLENBQU87SUFFZCxZQUFZLEdBQVcsRUFBRSxPQUFhO1FBQ2xDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVYLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7UUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsS0FBSyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNKO0FBWEQsOEJBV0MifQ==