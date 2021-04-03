import { AppSettingsService } from './AppSettingsService';
import { map } from 'rxjs/operators';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { SkillProfile, ProfileType } from './../model/skill';
import { ToastController } from '@ionic/angular';

@Injectable()
export class SkillProfileService  extends RemotePersistentDataService<SkillProfile> {

    constructor(
        appSettingsService: AppSettingsService,
        db: AngularFirestore,
        toastController: ToastController
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix() {
        return 'skillprofile';
    }

    getPriority(): number {
        return 3;
    }

    protected adjustFieldOnLoad(item: SkillProfile) {
        // console.log('SkillProfileService.adjustFieldOnLoad(' + item.id + ', profileType=' + item.profileType + ')');
        if (!item.profileType) {
            item.profileType = 'REFEREE';
        }
    }

    public allProfiles(profileType: ProfileType) {
        return this.all().pipe(
            map((r) => {
              if (r.data) {
                r.data = r.data.filter((item: SkillProfile) => item.profileType === profileType);
              }
              return r;
            })
          );
    }

    public sort(profiles: SkillProfile[], reverse: boolean = false): SkillProfile[] {
        if (!profiles) {
            return profiles;
        }
        let array: SkillProfile[] = profiles.sort(this.compare.bind(this));
        if (reverse) {
            array = array.reverse();
        }
        return array;
    }

    public compare(profile1: SkillProfile, profile2: SkillProfile): number {
        let res = 0;
        if (res === 0) {
          // Compare profile name
          res = profile1.name.localeCompare(profile2.name);
        }
        return res;
    }
}
