import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

import { LocalAppSettings } from './../model/settings';
import { AppSettingsService } from './AppSettingsService';
import { map } from 'rxjs/operators';

@Injectable()
export class VersionService {

    private applicationVersion = '1.2.0';

    constructor(
        protected appSettingsService: AppSettingsService,
        private storage: Storage,
    ) {}

    /**
     * Retrieves the current version of the application source code.
     */
    public getApplicationVersion(): string {
        return this.applicationVersion;
    }

    public migrate(): Observable<any> {
        return this.appSettingsService.get().pipe(
            map((local: LocalAppSettings) => {
                if (!local.applicationVersion || local.applicationVersion !== this.applicationVersion) {
                    // Perfom the migration steps
                    console.log(`Perfom the migration steps from ${local.applicationVersion} to ${this.applicationVersion}.`);

                    // initial to 1.0.0
                    if (!local.applicationVersion) {
                        local.applicationVersion = this.migrateInitialTo100();
                    }

                    // 1.0.0 to ... 1.1.0
                    if (local.applicationVersion === '1.0.0') {
                        local.applicationVersion = this.migrateInitialFrom100To110();
                    }

                    // 1.1.0 to ... 1.2.0
                    if (local.applicationVersion === '1.1.0') {
                        local.applicationVersion = this.migrateInitialFrom110To120();
                    }

                    // finally store the new version locally
                    console.log(`Set locally new version to ${this.applicationVersion}`);
                    this.appSettingsService.setApplicationVersion(this.applicationVersion);
                } else {
                    // console.log(`No migration tasks (current version is ${local.applicationVersion}).`);
                }
            })
        );
    }

    /**
     * Applies changes in the local databases from the initial version to version 1.0.0
     */
    private migrateInitialTo100(): string {
        console.log('Migrating from Inital version to version 1.0.0');
        return '1.0.0';
    }

    /**
     * Applies changes in the local databases from the version 1.0.0 to version 1.1.0
     */
    private migrateInitialFrom100To110(): string {
        return '1.1.0';
    }

    private migrateInitialFrom110To120(): string {
        return '1.2.0';
    }
}
