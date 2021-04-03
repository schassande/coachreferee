import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class BookmarkService {

    private entries: Bookmark[] = [];
    private context: Bookmark[] = [];
    private entriesSubject = new Subject<Bookmark[]>();
    private contextSubject = new Subject<Bookmark[]>();


    public addBookmarkEntry(newEntry: Bookmark): boolean {
        if (!newEntry || !newEntry.id || (!newEntry.url && !newEntry.handler) || !newEntry.label) {
            console.log('BookmarkService: Entry malformed: ' + JSON.stringify(newEntry));
            return false;
        }
        if (this.entries.filter((entry: Bookmark) => entry.id === newEntry.id).length > 0) {
            // already present
            return false;
        }
        this.entries.splice(0, 0, newEntry);
        this.entries.slice(4);
        this.entriesSubject.next(this.entries.slice());
        return true;
    }

    public removeBookmarkEntry(id: string) {
        for (let i = this.entries.length - 1; i >= 0; i--) {
            if (this.entries[i].id === id) {
                this.entries.splice(i, 1);
            }
        }
        this.entriesSubject.next(this.entries.slice());
    }

    public getBookmarks(): Observable<Bookmark[]> {
        return this.entriesSubject;
    }

    public clearBookmarks() {
        this.entries = [];
        this.entriesSubject.next(this.entries.slice());
    }
    public setBookmarks(bookmarks: Bookmark[]) {
        this.entries = bookmarks;
        this.entriesSubject.next(this.entries.slice());
    }

    public getContext(): Observable<Bookmark[]> {
        return this.contextSubject;
    }

    public setContext(context: Bookmark[]) {
        this.context = context;
        this.contextSubject.next(this.context.slice());
    }
    public clearContext() {
        this.context = [];
        this.contextSubject.next(this.context.slice());
    }
}

export interface Bookmark {
    id: string;
    label: string;
    url?: string;
    handler?: any;
    iconName?: string;
}
