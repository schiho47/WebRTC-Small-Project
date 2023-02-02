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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const runtime_1 = require("@prisma/client/runtime");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async signup(authDto) {
        const hash = await argon.hash(authDto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: authDto.email,
                    hash,
                },
            });
            return this.signToken(user.id, user.email);
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Email already exists');
                }
            }
            throw error;
        }
    }
    async signin(authDto) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    email: authDto.email,
                },
            });
            if (!user) {
                throw new common_1.ForbiddenException('Invalid email or password');
            }
            const pwMatches = await argon.verify(user.hash, authDto.password);
            if (!pwMatches) {
                throw new common_1.ForbiddenException('Invalid email or password');
            }
            return this.signToken(user.id, user.email);
        }
        catch (error) {
            throw error;
        }
    }
    async signToken(userId, email) {
        const data = {
            sub: userId,
            email,
        };
        const token = await this.jwt.signAsync(data, {
            expiresIn: this.config.get('JWT_EXPIRATION_TIME'),
            secret: this.config.get('JWT_SECRET'),
        });
        return { access_token: token };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map