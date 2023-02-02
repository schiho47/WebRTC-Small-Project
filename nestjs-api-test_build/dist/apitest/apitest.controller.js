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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApitestController = void 0;
const common_1 = require("@nestjs/common");
const guard_1 = require("../auth/guard");
let ApitestController = class ApitestController {
    getHttpOk() {
        return {
            rtMsg: 'Message from server: OK',
            rtData: 'OK',
        };
    }
    getHttpBadRequest() {
        return {
            rtMsg: 'Message from server: Bad Request',
            rtData: 'Bad Request',
        };
    }
    getHttpUnauthorized() {
        return {
            rtMsg: 'Message from server: Unautorized',
            rtData: 'Unauthorized',
        };
    }
    getHttpForbidden() {
        return {
            rtMsg: 'Message from server: Forbidden',
            rtData: 'Forbidden',
        };
    }
    getHttpNotFound() {
        return {
            rtMsg: 'Message from server: Not Found',
            rtData: 'NotFound',
        };
    }
    getHttpInternalServerError() {
        return {
            rtMsg: 'Message from server: Internal Server Error',
            rtData: 'Internal Server Error',
        };
    }
    getHttpDelay() {
        let counter = 0;
        for (let i = 0; i < 100000; i++) {
            counter++;
            console.log(counter);
        }
        return {
            rtMsg: 'Message from server: Delay response',
            rtData: `Delay response result: ${counter}`,
        };
    }
    getHttpServerError() {
        throw new Error('Server Error');
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('200'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpOk", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.BAD_REQUEST),
    (0, common_1.Post)('400'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpBadRequest", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.UNAUTHORIZED),
    (0, common_1.Post)('401'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpUnauthorized", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.FORBIDDEN),
    (0, common_1.Post)('403'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpForbidden", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.NOT_FOUND),
    (0, common_1.Post)('404'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpNotFound", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.INTERNAL_SERVER_ERROR),
    (0, common_1.Post)('500'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpInternalServerError", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('delay'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpDelay", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('server-error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ApitestController.prototype, "getHttpServerError", null);
ApitestController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('api')
], ApitestController);
exports.ApitestController = ApitestController;
//# sourceMappingURL=apitest.controller.js.map