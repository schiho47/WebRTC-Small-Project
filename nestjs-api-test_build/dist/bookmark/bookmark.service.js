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
exports.BookmarkService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BookmarkService = class BookmarkService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBookmarks(userId) {
        try {
            const bookmarks = await this.prisma.bookmark.findMany({
                where: {
                    userId,
                },
            });
            return bookmarks;
        }
        catch (error) {
            throw error;
        }
    }
    async getBookmarkById(userId, bookmarkId) {
        try {
            const bookmark = await this.prisma.bookmark.findFirst({
                where: {
                    id: bookmarkId,
                    userId,
                },
            });
            return bookmark;
        }
        catch (error) {
            throw error;
        }
    }
    async createBookmark(userId, dto) {
        try {
            const bookmark = await this.prisma.bookmark.create({
                data: Object.assign({ userId }, dto),
            });
            return bookmark;
        }
        catch (error) {
            throw error;
        }
    }
    async editBookmark(userId, bookmarkId, dto) {
        try {
            const bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId,
                },
            });
            if (!bookmark || bookmark.userId !== userId) {
                throw new common_1.ForbiddenException('Access to resource denied');
            }
            const updatedBookmark = await this.prisma.bookmark.update({
                where: {
                    id: bookmarkId,
                },
                data: Object.assign({}, dto),
            });
            return updatedBookmark;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteBookmark(userId, bookmarkId) {
        try {
            const bookmark = await this.prisma.bookmark.findUnique({
                where: {
                    id: bookmarkId,
                },
            });
            if (!bookmark || bookmark.userId !== userId) {
                throw new common_1.ForbiddenException('Access to resource denied');
            }
            const deletedBookmark = await this.prisma.bookmark.delete({
                where: {
                    id: bookmarkId,
                },
            });
            return deletedBookmark.id;
        }
        catch (error) {
            throw error;
        }
    }
};
BookmarkService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookmarkService);
exports.BookmarkService = BookmarkService;
//# sourceMappingURL=bookmark.service.js.map