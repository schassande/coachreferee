import { Observable, from, of } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { map } from 'rxjs/operators';

export abstract class LocalSingletonDataService<D extends any> {

    private data: D;
    private static storageInitialisationPromise: Promise<Storage>;

    constructor(storage: Storage, protected storageName: string) {
        LocalSingletonDataService.init(storage);
    }

    private static init(storage: Storage) {
        if (LocalSingletonDataService.storageInitialisationPromise === undefined) {
            LocalSingletonDataService.storageInitialisationPromise = new Promise((resolve: any) => {
                storage.create()
                    .then((s) => resolve(s))
                    .catch((err) => resolve(storage));
            });
        }
    }

    public get(): Observable<D> {
        if (this.data) {
            return of(this.data);
        } else {
            return from(LocalSingletonDataService.storageInitialisationPromise
                .then((storage: Storage) => storage.get(this.storageName)));
        }
    }

    public save(data: D): Observable<D> {
        this.data = data;
        return from(LocalSingletonDataService.storageInitialisationPromise
            .then((storage: Storage) => storage.set(this.storageName, data)))
            .pipe(map(() => data));
    }

    public delete(): Observable<any> {
        this.data = null;
        return from(LocalSingletonDataService.storageInitialisationPromise
            .then((storage: Storage) => storage.remove(this.storageName)));
    }
}
