import { PhotoEvent } from './../../widget/camera-icon-component';
import { HelpService } from './../../../app/service/HelpService';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalController, LoadingController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { ResponseWithData } from './../../../app/service/response';
import { RefereeService } from './../../../app/service/RefereeService';
import { Referee, CONSTANTES } from './../../../app/model/user';

/**
 * Generated class for the RefereeNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-referee-edit',
  templateUrl: 'referee-edit.html',
})
export class RefereeEditPage implements OnInit {
  referee: Referee;
  error: string[] = [];
  constantes = CONSTANTES;
  imageUrl: string = null;

  constructor(public modalController: ModalController,
              private route: ActivatedRoute,
              private helpService: HelpService,
              public refereeService: RefereeService,
              public connectedUserService: ConnectedUserService,
              private afStorage: AngularFireStorage,
              public loadingCtrl: LoadingController
    ) {
  }

  ngOnInit() {
    this.helpService.setHelp('referee-edit');
    this.refereeService.lastSelectedReferee.referee = null;
    if (this.referee) {
      this.setReferee(this.referee);
    } else {
      this.route.paramMap.pipe(
        map((params: ParamMap) => {
          const id = params.get('id');
          if (id) {
            console.log('RefereeEditPage edit existing referee: ', id);
            this.setRefereeId(id);
          } else {
            console.log('RefereeEditPage new referee: ');
            this.setReferee(this.buildNewReferee());
          }
        })
      ).subscribe();
    }
  }

  private buildNewReferee(): Referee {
    return {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      firstName: '',
      lastName: '',
      shortName: '',
      country: '',
      email: '',
      gender: 'M',
      mobilePhones: [ ],
      photo: {path: null, url: null},
      speakingLanguages: [ 'EN' ],
      referee : {
          refereeLevel: 'EURO_1',
          refereeCategory : 'OPEN',
          nextRefereeLevel: null,
          region: 'Others'
      },
      refereeCoach: {
          refereeCoachLevel: 'NONE'
      },
      dataSharingAgreement: {
        personnalInfoSharing: 'YES',
        photoSharing: 'YES',
        refereeAssessmentSharing: 'YES',
        refereeCoachingInfoSharing: 'YES'
      }
    };
  }

  isValid(): boolean {
    this.error = [];
    if (!this.isValidString(this.referee.firstName, 3, 15)) {
      this.error.push(('Invalid first name: 3 to 15 chars'));
    }
    if (!this.isValidString(this.referee.lastName, 3, 15)) {
      this.error.push(('Invalid last name: 3 to 15 chars'));
    }
    if (!this.isValidString(this.referee.shortName, 3, 5)) {
      this.error.push(('Invalid short name: 3 to 5 chars'));
    }
    return this.error.length === 0;
  }
  isValidString(str: string, minimalLength: number = 0, maximalLength: number = 100): boolean {
    return str && str.trim().length >= minimalLength && str.trim().length <= maximalLength;
  }

  updateShortName() {
    if (this.isValidString(this.referee.firstName, 3)
      && this.isValidString(this.referee.lastName, 3)
      && (!this.referee.shortName || this.referee.shortName.trim().length === 0)) {
        this.referee.shortName = this.referee.firstName.charAt(0).toUpperCase()
          + this.referee.lastName.charAt(0).toUpperCase()
          + this.referee.lastName.charAt(this.referee.lastName.length - 1).toUpperCase();
    }
  }
  private setRefereeId(id: string) {
    console.log('RefereeEdit.setRefereeId(' + id + ')');
    this.refereeService.get(id).subscribe((response: ResponseWithData<Referee>) => {
      if (response.error) {
        this.loadingCtrl.create({
          message: 'Problem to load referee informaion ...',
          duration: 3000
        }).then((loader) => loader.present())
        .then(() => {
          this.modalController.dismiss();
        });
      } else {
        this.setReferee(response.data);
      }
    });
  }

  private setReferee(ref: Referee) {
    this.referee = this.ensureDataSharing(ref);
  }

  private ensureDataSharing(ref: Referee): Referee {
    if (!ref.dataSharingAgreement) {
      console.log('Add dataSharingAgreement field to the existing referee.');
      ref.dataSharingAgreement = {
        personnalInfoSharing: 'YES',
        photoSharing: 'YES',
        refereeAssessmentSharing: 'YES',
        refereeCoachingInfoSharing: 'YES'
      };
    }
    return ref;
  }

  public save() {
    if (this.isValid()) {
        this.refereeService.save(this.referee).subscribe((response: ResponseWithData<Referee>) => {
        if (response.error) {
          this.error.push('Error when saving new user: ' + this.error);
        } else {
          this.referee = response.data;
          this.refereeService.lastSelectedReferee.referee = this.referee;
          this.modalController.dismiss({ referee: this.referee});
        }
      });
    }
  }

  public cancel() {
    this.refereeService.lastSelectedReferee.referee = null;
    this.modalController.dismiss();
  }

  onImage(event: PhotoEvent) {
    if (event && event.url) {
      this.referee.photo.url = event.url;
      this.referee.photo.path = event.path;
    }
  }
  onSwipe(event) {
    if (event.direction === 4) {
      this.cancel();
    }
  }
}
