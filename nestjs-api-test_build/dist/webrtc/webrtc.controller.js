"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebrtcController = void 0;
const common_1 = require("@nestjs/common");
const agora_access_token_1 = require("agora-access-token");
let WebrtcController = class WebrtcController {
    getToken(uid) {
        const APP_ID = 'f46877cd33004df3a9b375674f4e4f80';
        const APP_CERTIFICATION = 'c81711571b7a47edbd015a4cf5535d49';
        const channelName = 'main';
        const role = agora_access_token_1.RtmRole.Rtm_User;
        const EXPIRED_IN_SECONDS = 3600;
        const currentTimeStamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTime = currentTimeStamp + EXPIRED_IN_SECONDS;
        const token = agora_access_token_1.RtmTokenBuilder.buildToken(APP_ID, APP_CERTIFICATION, uid, role, privilegeExpiredTime);
        return { token, uid };
    }
};
__decorate([
    (0, common_1.Get)('token/:uid'),
    __param(0, (0, common_1.Param)('uid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WebrtcController.prototype, "getToken", null);
WebrtcController = __decorate([
    (0, common_1.Controller)('webrtc')
], WebrtcController);
exports.WebrtcController = WebrtcController;
//# sourceMappingURL=webrtc.controller.js.map