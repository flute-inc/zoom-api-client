"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomError = void 0;
class ZoomError extends Error {
    constructor(msg) {
        super(msg);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ZoomError = ZoomError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBYSxTQUFVLFNBQVEsS0FBSztJQUNoQyxZQUFZLEdBQUc7UUFDWCxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFWCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBRWxDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FDSjtBQVJELDhCQVFDIn0=