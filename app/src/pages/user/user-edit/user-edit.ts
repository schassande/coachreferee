import { InvitationService } from './../../../app/service/InvitationService';
import { PersistentDataUpdater } from '../../../app/service/PersistentDataFonctions';
import { Component, OnInit } from '@angular/core';
import { map, flatMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoadingController, NavController, ToastController, AlertController } from '@ionic/angular';
import { ConnectedUserService } from '../../../app/service/ConnectedUserService';
import { ResponseWithData } from '../../../app/service/response';
import { UserService } from '../../../app/service/UserService';
import { User, CONSTANTES } from '../../../app/model/user';

import { PhotoEvent } from '../../widget/camera-icon-component';

/**
 * Generated class for the UserNewPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-edit',
  templateUrl: 'user-edit.html',
})
export class UserEditPage implements OnInit {
  user: User;
  error: string[] = [];
  constantes = CONSTANTES;
  saving = false;

  constructor(
    private alertCtrl: AlertController,
    private navController: NavController,
    private route: ActivatedRoute,
    public userService: UserService,
    public connectedUserService: ConnectedUserService,
    private invitationService: InvitationService,
    private toastController: ToastController,
    public loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map( (paramMap: ParamMap) => {
        const userId = paramMap.get('id');
        if (userId) {
          this.userService.get(userId).subscribe((res: ResponseWithData<User>) => {
            if (res.error) {
              this.loadingCtrl.create({
                message: 'Problem to load referee informaion ...',
                duration: 3000
              }).then( (loader) => loader.present())
              .then(() => {
                this.navController.navigateRoot('/home');
              });
            } else {
              this.user = res.data;
              console.log('load user: ', this.user);
              this.ensureDataSharing();
            }
          });
        } else {
          this.initReferee();
        }
          })
    ).subscribe();
  }

  private ensureDataSharing() {
    if (!this.user.dataSharingAgreement) {
      console.log('Add dataSharingAgreement field to the existing user.');
      this.user.dataSharingAgreement = {
        personnalInfoSharing: 'YES',
        photoSharing: 'YES',
        refereeAssessmentSharing: 'YES',
        refereeCoachingInfoSharing: 'YES',
        coachAssessmentSharing: 'YES',
        coachCoachingInfoSharing: 'YES',
        coachProSharing: 'NO'
      };
    }
  }

  public initReferee() {
    this.user = {
      id: null,
      accountId: null,
      accountStatus: 'VALIDATION_REQUIRED',
      role: 'USER',
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      firstName: '',
      lastName: '',
      shortName: '',
      country: CONSTANTES.countries[0][0],
      email: '',
      gender: 'M',
      mobilePhones: [ ],
      photo: {
        path: null,
        url: null
      },
      speakingLanguages: [ 'EN' ],
      referee : {
          refereeLevel: null,
          refereeCategory : 'OPEN',
          nextRefereeLevel: null,
          region: 'Others'
      },
      refereeCoach: {
          refereeCoachLevel: null
      },
      password: '',
      token: null,
      defaultCompetition: '',
      defaultCompetitionId: '',
      region: 'Others',
      defaultGameCatory: 'OPEN',
      dataSharingAgreement: {
        personnalInfoSharing: 'YES',
        photoSharing: 'YES',
        refereeAssessmentSharing: 'YES',
        refereeCoachingInfoSharing: 'YES',
        coachAssessmentSharing: 'YES',
        coachCoachingInfoSharing: 'YES',
        coachProSharing: 'NO'
      },
      groupIds: []
    };
  }
  isValid(): boolean {
    this.error = [];
    if (!this.isValidString(this.user.firstName, 3, 15)) {
      this.error.push(('Invalid first name: 3 to 15 chars'));
    }
    if (!this.isValidString(this.user.lastName, 3, 25)) {
      this.error.push(('Invalid last name: 3 to 25 chars'));
    }
    if (!this.isValidString(this.user.shortName, 3, 5)) {
      this.error.push(('Invalid short name: 3 to 5 chars'));
    }
    if (!this.isValidString(this.user.email, 5, 50)) {
      this.error.push(('Invalid email: 5 to 50 chars'));
    }
    return this.error.length === 0;
  }
  isValidString(str: string, minimalLength: number = 0, maximalLength: number = 100): boolean {
    return str && str.trim().length >= minimalLength && str.trim().length <= maximalLength;
  }

  updateShortName() {
    if (this.isValidString(this.user.firstName, 3)
      && this.isValidString(this.user.lastName, 3)
      && (!this.user.shortName || this.user.shortName.trim().length === 0)) {
        this.user.shortName = this.userService.computeShortName(this.user.firstName, this.user.lastName);
    }
  }

  public newUser(event) {
    if (this.isValid()) {
      this.saving = true;
      this.invitationService.getByEmail(this.user.email).pipe(
        flatMap((rinv) => {
          if (rinv.data && rinv.data.expirationDate.getTime() > new Date().getTime()) {
            console.log('The user has been invited.');
            this.user.accountStatus = 'ACTIVE';
          }
          return this.userService.save(this.user);
        }),
        map((response: ResponseWithData<User>) => {
          if (response.error) {
            this.saving = false;
            this.error = response.error.error;
            if (response.error.code === 'auth/email-already-in-use') {
              console.log('The email addresse is already used.');
              this.toastController.create({ message: 'The email addresse is already used: ' + this.user.email, duration: 10000})
                .then((toast) => toast.present());
            } else {
              console.log('Error', response.error);
              this.toastController.create({ message: 'Error when saving the user info: ' + response.error, duration: 10000})
                .then((toast) => toast.present());
            }
          } else {
            this.user = response.data;
            console.log('Saved user: ', this.user);
            if (this.user.accountStatus === 'VALIDATION_REQUIRED') {
              this.navController.navigateRoot('/user/waiting-validation');
            }
            this.saving = false;
          }
        })
      ).subscribe();
    }
  }

  onImage(event: PhotoEvent) {
    if (event && event.url) {
      this.user.photo.url = event.url;
      this.user.photo.path = event.path;
    }
  }
  deleteAccount() {
    this.alertCtrl.create({
      message: 'Do you really want to delete your account ' + this.user.shortName  +  '?<br>All data will be removed !!',
      buttons: [
        { text: 'Cancel', role: 'cancel'},
        {
          text: 'Delete',
          handler: () => {
            this.userService.deleteAccount(this.user);
            this.navController.navigateRoot('/user/login');
          }
        }
      ]
    }).then( (alert) => alert.present() );
  }
  cancel() {
    if (this.user.dataStatus === 'NEW') {
      this.navController.navigateRoot('/user/login');
    } else {
      this.navController.navigateRoot('/home');
    }
  }
}
