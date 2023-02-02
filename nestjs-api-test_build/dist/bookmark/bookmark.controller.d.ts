import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
export declare class BookmarkController {
    private bookmarkService;
    constructor(bookmarkService: BookmarkService);
    getAllBookmarks(userId: number): Promise<import(".prisma/client").Bookmark[]>;
    getBookmarkById(userId: number, bookmarkId: number): Promise<import(".prisma/client").Bookmark>;
    createBookmark(userId: number, dto: CreateBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto): Promise<import(".prisma/client").Bookmark>;
    deleteBookmark(userId: number, bookmarkId: number): Promise<number>;
}
