import { AngularFireFunctions } from '@angular/fire/functions';
import { LocalAppSettings } from './../model/settings';
import { AppSettingsService } from './AppSettingsService';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AngularFirestore, Query } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserCredential } from '@firebase/auth-types';

import { ResponseWithData, Response } from './response';
import { Observable, of, from, Subject } from 'rxjs';
import { ConnectedUserService } from './ConnectedUserService';
import { Injectable } from '@angular/core';
import { User, CONSTANTES, AuthProvider, CurrentApplicationName, AppRole, RefereeLevel, RefereeCoachLevel } from './../model/user';
import { RemotePersistentDataService } from './RemotePersistentDataService';
import { mergeMap, map, catchError } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { PersistentDataFilter } from './PersistentDataFonctions';
import { DataRegion } from '../model/common';

@Injectable()
export class UserService  extends RemotePersistentDataService<User> {

    constructor(
        db: AngularFirestore,
        toastController: ToastController,
        private connectedUserService: ConnectedUserService,
        appSettingsService: AppSettingsService,
        private alertCtrl: AlertController,
        private loadingController: LoadingController,
        private angularFireFunctions: AngularFireFunctions,
        private angularFireAuth: AngularFireAuth
    ) {
        super(appSettingsService, db, toastController);
    }

    getLocalStoragePrefix(): string {
        return 'user';
    }

    getPriority(): number {
        return 1;
    }

    protected adjustFieldOnLoad(item: User) {
        if (item.defaultCompetitionId === undefined || item.defaultCompetitionId === null) {
            item.defaultCompetitionId = '';
        }
        if (item.region === undefined || item.region === null) {
            item.region = 'Others';
        }
        if (!item.accountStatus) {
            item.accountStatus = 'ACTIVE';
        }
    }

    public save(user: User, cred: UserCredential = null): Observable<ResponseWithData<User>> {
        if (!user) {
            return of({data: null, error: { error : 'null user', errorCode: -1}});
        }
        const password = user.password;
        delete user.password;
        if (user.dataStatus === 'NEW' && user.accountStatus !== 'NO_ACCOUNT') {
            let obs: Observable<UserCredential> = null;
            if (cred !== null  && (user.authProvider === 'FACEBOOK' || user.authProvider === 'GOOGLE')) {
                obs = of(cred);
            } else {
                obs = from(this.angularFireAuth.createUserWithEmailAndPassword(user.email, password));
            }
            return obs.pipe(
                mergeMap((userCred: UserCredential) => {
                    // Store in application user datbase the firestore user id
                    console.log('User has been created on firebase with the id: ', userCred.user.uid);
                    user.accountId = userCred.user.uid;
                    return super.save(user);
                }),
                mergeMap((ruser) => {
                    if (ruser.data) {
                        console.log('User has been created on user database with the id: ', ruser.data.id);
                        // Send an email to admin with the account to validate
                        this.sendNewAccountToAdmin(ruser.data.id).subscribe();
                        this.sendNewAccountToUser(ruser.data.id).subscribe();
                        this.appSettingsService.setLastUser(user.email, password);
                        if (ruser.data.accountStatus === 'ACTIVE') {
                            return this.autoLogin();
                        }
                    } else {
                        console.log('Error on the user creation: ', ruser.error);
                    }
                    return of(ruser);
                }),
                catchError((err) => {
                    console.error('Error on the user creation: ', err);
                    return of({ error: err, data: null});
                }),
            );
        } else {
            return super.save(user);
        }
    }

    public delete(id: string): Observable<Response> {
        // check the user to delete is the current user.
        if (this.connectedUserService.getCurrentUser().id !== id && !this.connectedUserService.isAdmin()) {
            return of({error: {error: 'Not current user', errorCode: 1}});
        }
        // First get the user from database
        return super.get(id).pipe(
            mergeMap(ruser => {
                if (!ruser.data) {
                    console.log('User ' + id + ' does not exist.');
                    return of({error: null});
                }
                const user: User = ruser.data;
                // remove the roles from this application
                user.applications = user.applications.filter(an => an.name !== CurrentApplicationName);
                user.demandingApplications = user.demandingApplications.filter(an => an.name !== CurrentApplicationName);
                if (user.accountStatus === 'NO_ACCOUNT' || (user.applications.length === 0 && user.demandingApplications.length === 0)) {
                    // The user has no other roles from the other applications => delete him/her really
                    let obs = super.delete(id);
                    if (this.connectedUserService.getCurrentUser().id === id) {
                        obs = obs.pipe(
                            mergeMap(() => from(this.angularFireAuth.currentUser)),
                            mergeMap((fireBaseUser) => from(fireBaseUser.delete())),
                            map(() => {
                                return {error: null};
                            }),
                            catchError((err) => {
                                console.error(err);
                                return of({error: err});
                            })
                        );
                    }
                    return obs.pipe(map((res) => {
                        if (!res.error) {
                            console.log('User ' + id + ' deleted.');
                        }
                        return res;
                    }));

                } else {
                    // save the user with the reduced list of roles
                    return this.save(ruser.data).pipe(map((res) => {
                        if (!res.error) {
                            console.log('User ' + id + ' removed from the application ' + CurrentApplicationName);
                        }
                        return res;
                    }));
                }
            })
        );
    }


    public login(email: string, password: string): Observable<ResponseWithData<User>> {
        console.log('UserService.login(' + email + ', ' + password + ')');
        let credential = null;
        return from(this.angularFireAuth.signInWithEmailAndPassword(email, password)).pipe(
            mergeMap( (cred: UserCredential) => {
                credential = cred;
                // console.log('login: cred=', JSON.stringify(cred, null, 2));
                return this.getByEmail(email);
            }),
            catchError((err) => {
                console.log('UserService.login(' + email + ', ' + password + ') error=', err);
                this.loadingController.dismiss(null);
                console.error(err);
                if (err.code !== 'auth/network-request-failed') {
                    this.alertCtrl.create({message: err.message}).then((alert) => alert.present());
                }
                return of({ error: err, data: null});
            }),
            map( (ruser: ResponseWithData<User>) => {
                // console.log('UserService.login(' + email + ', ' + password + ') ruser=', ruser);
                if (ruser.data) {
                    switch (ruser.data.accountStatus) {
                    case 'ACTIVE':
                        this.connectedUserService.userConnected(ruser.data, credential);
                        break;
                    case 'DELETED':
                        ruser.data = null;
                        ruser.error = { error : 'The account \'' + email + '\' has been removed. Please contact the administrator.',
                                        errorCode : 1234 };
                        break;
                    case 'LOCKED':
                        ruser.data = null;
                        ruser.error = { error : 'The account \'' + email + '\' has been locked. Please contact the administrator.',
                                        errorCode : 1234 };
                        break;
                    case 'VALIDATION_REQUIRED':
                        ruser.data = null;
                        ruser.error = { error : 'A validation is still required for the account \'' + email + '\'.',
                                        errorCode : 1234 };
                        break;
                    }
                } else if (!ruser.error) {
                    const msg = 'Unexpected problem, please contact the administrator with the following data: '
                        + '<br>server response: ' + JSON.stringify(ruser)
                        + '<br>credential: ' + JSON.stringify(credential);
                    console.error(msg);
                    this.alertCtrl.create({message: msg}).then((alert) => alert.present());
                    ruser.error = { error : msg, errorCode : 1234 };
                }
                return ruser;
            })
        );
    }

    public logout() {
        console.log('UserService.logout()');
        this.connectedUserService.userDisconnected();
    }

    /**
     * Try to autologin an user with data stored from local storage.
     */
    public autoLogin(): Observable<ResponseWithData<User>> {
        let loading = null;
        return from(this.loadingController.create({ message: 'Auto login...', translucent: true})).pipe(
            mergeMap( (ctrl) => {
                loading = ctrl;
                loading.present();
                return this.appSettingsService.get();
            }),
            mergeMap((settings: LocalAppSettings) => {
                const email = settings.lastUserEmail;
                const password = settings.lastUserPassword;
                console.log('UserService.autoLogin(): lastUserEmail=' + email + ', lastUserPassword=' + password);
                if (!email) {
                    loading.dismiss();
                    return of({ error: null, data: null});
                }
                if (!this.connectedUserService.isOnline() || settings.forceOffline) {
                    console.log('UserService.autoLogin(): offline => connect with email only');
                    loading.dismiss();
                    return this.connectByEmail(email, password);
                }
                if (password) {
                    // password is defined => try to login
                    console.log('UserService.autoLogin(): login(' + email + ', ' + password + ')');
                    return this.login(email, password).pipe(
                        map((ruser) =>  {
                            loading.dismiss();
                            return ruser;
                        })
                    );
                }
                loading.dismiss();
                return of({data: null, error: null});
            })
        );
    }

    public resetPassword(email, sub: Subject<ResponseWithData<User>> = null) {
        // console.log('Reset password of the account', email);
        this.angularFireAuth.sendPasswordResetEmail(email).then(() => {
            this.alertCtrl.create({message: 'An email has been sent to \'' + email + '\' to reset the password.'})
                .then((alert) => alert.present());
            if (sub) {
                sub.next({ error: null, data: null});
                sub.complete();
            }
        });
    }

    public loginWithEmailNPassword(email: string,
                                   password: string,
                                   savePassword: boolean): Observable<ResponseWithData<User>> {
        console.log('loginWithEmailNPassword(' + email + ', ' + password + ', ' + savePassword + ')');
        return this.login(email, password).pipe(
            mergeMap ( (ruser) => {
                if (ruser.error) {
                    // login failed
                    savePassword = false; // don't save the password if error occurs
                    if (ruser.error.code === 'auth/network-request-failed') {
                        // no network => check the email/password with local storage
                        return this.connectByEmail(email, password);
                    }
                }
                return of(ruser);
            }),
            map( (ruser) => {
                if (ruser.data) { // Login with success
                    console.log('UserService.loginWithEmailNPassword(' + email + '): login with success');
                    if (savePassword) {
                        console.log('UserService.askPasswordToLogin(' + email + '): store password.');
                        // The user is ok to store password in settings on local device
                        this.appSettingsService.setLastUser(email, password);
                    }
                }
                return ruser;
            })
        );
    }

    private connectByEmail(email: string, password: string = null): Observable<ResponseWithData<User>> {
        return this.appSettingsService.get().pipe(
            mergeMap((appSettings) => {
                if (email === appSettings.lastUserEmail && (password == null || password === appSettings.lastUserPassword)) {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): password is valid => get user');
                    return this.getByEmail(email);
                } else {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): wrong password.');
                    return of({ error: null, data: null });
                }
            }),
            map( (ruser: ResponseWithData<User>) => {
                if (ruser.data) {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): user found', ruser.data);
                    this.connectedUserService.userConnected(ruser.data, null);
                } else {
                    console.log('UserService.connectByEmail(' + email + ',' + password + '): fail.');
                }
                return ruser;
            })
        );
}
    public getUrlPathOfGet(id: number) {
        return '?id=' + id;
    }

    public getByEmail(email: string): Observable<ResponseWithData<User>> {
        return this.queryOne(this.getCollectionRef().where('email', '==', email), 'default').pipe(
            map((ruser => {
                // console.log('UserService.getByEmail(' + email + ')=', ruser.data);
                return ruser;
            })),
            catchError((err) => {
                return of({ error: err, data: null});
            }),
        );
    }
    public findByShortName(shortName: string): Observable<ResponseWithData<User[]>> {
        return this.query(this.getCollectionRef().where('shortName', '==', shortName), 'default');
    }
/*
    public authWithGoogle(): Observable<ResponseWithData<User>> {
        return this.authWith(new GoogleAuthProvider(), 'GOOGLE');
    }

    public authWithFacebook(): Observable<ResponseWithData<User>> {
        return this.authWith(new FacebookAuthProvider(), 'FACEBOOK');
    }
*/
    public authWith(authProvider: any, authName: AuthProvider): Observable<ResponseWithData<User>> {
        let credential = null;
        return from(this.angularFireAuth.signInWithPopup(authProvider)).pipe(
            mergeMap( (cred: UserCredential) => {
                credential = cred;
                console.log('authWith: cred=', JSON.stringify(cred, null, 2));
                return this.getByEmail(cred.user.email);
            }),
            catchError((err) => {
                // console.log('authWith error: ', err);
                return of({ error: err, data: null});
            }),
            mergeMap( (ruser: ResponseWithData<User>) => {
                if (!ruser.data) {
                    return this.save(this.createUserFromCredential(credential, authName), credential);
                } else {
                    return of(ruser);
                }
            }),
            map( (ruser: ResponseWithData<User>) => {
                console.log('authWith user: ', JSON.stringify(ruser));
                if (ruser.data) {
                    this.connectedUserService.userConnected(ruser.data, credential);
                }
                return ruser;
            })
        );
    }
    public computeShortName(firstName, lastName): string {
        return firstName.charAt(0).toUpperCase()
            + lastName.charAt(0).toUpperCase()
            + lastName.charAt(lastName.length - 1).toUpperCase();
    }

    private createUserFromCredential(cred: UserCredential, authProvider: AuthProvider): User {
        if (!cred || !cred.user) {
            return null;
        }
        const names = cred.user.displayName.split(' ');
        const firstName: string = names[0];
        const lastName: string = names.length > 1 ? names[1] : ' ';
        const shortName: string = this.computeShortName(firstName, lastName);
        return {
            id: null,
            accountId: cred.user.uid,
            accountStatus: 'VALIDATION_REQUIRED',
            applications: [],
            demandingApplications: [{name: CurrentApplicationName, role: 'REFEREE_COACH'}],
            authProvider,
            version: 0,
            creationDate : new Date(),
            lastUpdate : new Date(),
            dataStatus: 'NEW',
            firstName,
            lastName,
            shortName,
            country: CONSTANTES.countries[0][0],
            email: cred.user.email,
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
                nextRefereeLevel: null
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
    deleteAccount(user: User): void {
        if (user.id ===  this.connectedUserService.getCurrentUser().id) {
            from(this.angularFireAuth.currentUser).pipe(
                mergeMap((u) => u.delete()),
                mergeMap(() => this.delete(user.id)),
                map(() => this.connectedUserService.userDisconnected())
            ).subscribe();
        } else {
            this.delete(user.id).subscribe();
        }
    }

    public sendNewAccountToAdmin(userId: string): Observable<any> {
        return this.angularFireFunctions.httpsCallable('sendNewAccountToAdmin')({userId});
    }
    public sendNewAccountToUser(userId: string): Observable<any> {
        return this.angularFireFunctions.httpsCallable('sendNewAccountToUser')({userId});
    }
    public sendAccountValidated(userId: string): Observable<any> {
        return this.angularFireFunctions.httpsCallable('sendAccountValidated')({userId});
    }
    public sendAccountNotValidated(userId: string): Observable<any> {
        return this.angularFireFunctions.httpsCallable('sendAccountNotValidated')({userId});
    }

    public sortUsers(users: User[]): User[] {
        if (users) {
            users.sort((u1, u2) => {
                let res = u1.firstName.localeCompare(u2.firstName);
                if (res === 0) {
                    res = u1.lastName.localeCompare(u2.lastName);
                }
                return res;
            });
        }
        return users;
    }

    public findPendingValidations(role: AppRole, country: string = null): Observable<ResponseWithData<User[]>> {
        let q: Query<User> = this.getCollectionRef().where(
                'demandingApplications',
                'array-contains',
                { name : CurrentApplicationName, role}
            );
        if (country) {
            q = q.where('country', '==', country);
        }
        return this.query(q, 'default');
    }

    public searchUsers(criteria: UserSearchCriteria):
            Observable<ResponseWithData<User[]>> {
        let q: Query<User> = this.getCollectionRef();
        if (criteria.role) {
            console.log('filter by applications', criteria.role);
            q = q.where('applications', 'array-contains', { name : CurrentApplicationName, role: criteria.role});
        }
        if (criteria.region) {
            console.log('filter by region', criteria.region);
            q = q.where('region', '==', criteria.region);
        }
        if (criteria.country) {
            console.log('filter by country', criteria.country);
            q = q.where('country', '==', criteria.country);
        }
        if (criteria.refereeLevel) {
            console.log('filter by refereeLevel', criteria.refereeLevel);
            q = q.where('referee.refereeLevel', '==', criteria.refereeLevel);
        }
        if (criteria.refereeCoachLevel) {
            console.log('filter by refereeCoachLevel', criteria.refereeCoachLevel);
            q = q.where('refereeCoach.refereeCoachLevel', '==', criteria.refereeCoachLevel);
        }
        return super.filter(this.query(q, 'default'), this.getFilterByText(criteria.text));
    }

    public searchRefereeCoaches(text: string): Observable<ResponseWithData<User[]>> {
        return this.searchUsers({
            role: 'REFEREE_COACH',
            region: this.connectedUserService.getCurrentUser().region,
            text});
    }

    public searchReferees(text: string = null, country: string = null, refereeLevel: RefereeLevel = null):
            Observable<ResponseWithData<User[]>> {
        return this.searchUsers({
            role: 'REFEREE',
            // region: this.connectedUserService.getCurrentUser().region,
            country, refereeLevel, text});
    }

    public getFilterByText(text: string): PersistentDataFilter<User> {
        const validText = text && text !== null  && text.trim().length > 0 ? text.trim() : null;
        return validText === null ? null : (user: User) => {
            return this.stringContains(validText, user.shortName)
                || this.stringContains(validText, user.firstName)
                || this.stringContains(validText, user.lastName);
        };
    }

    public validateRole(user: User, role: AppRole): Observable<ResponseWithData<User>> {
        // validate the use of the application
        user.demandingApplications = user.demandingApplications
          .filter(ar => !(ar.name === CurrentApplicationName && ar.role === role));
        user.applications.push({name: CurrentApplicationName, role});

        // Active the account if required
        const accountValidation: boolean = user.accountStatus === 'VALIDATION_REQUIRED';
        if (accountValidation) {
          user.accountStatus = 'ACTIVE';
        }

        // Save the user account and send emails if required
        return this.save(user).pipe(
          mergeMap((ruser) => {
            if (accountValidation && ruser.data && ruser.data.accountStatus === 'ACTIVE') {
              return this.sendAccountValidated(user.id).pipe(map(() => ruser));
            }
            return of(ruser);
          }),
        );
      }

    public unvalidateRole(user: User, role: AppRole): Observable<ResponseWithData<User>> {
        // Invalidate the use of the application
        user.demandingApplications = user.demandingApplications
          .filter(ar => !(ar.name === CurrentApplicationName && ar.role === role));

          // deactivate the account if required
        if (user.demandingApplications.length === 0 && user.applications.length === 0) {
          user.accountStatus = 'DELETED';
        }

        // Save the user account and send emails if required
        return this.save(user).pipe(
          mergeMap((ruser) => {
            if (ruser.data && ruser.data.accountStatus === 'DELETED') {
              return this.sendAccountNotValidated(user.id).pipe(map(() => ruser));
            }
            return of(ruser);
          }),
        );
    }

    public listToCSV(referees: User[]): string {
        let content = 'firstName, lastName, shortName, country, email, gender, mobilePhones'
        + ', speakingLanguages, refereeLevel, refereeCategory, nextRefereeLevel\n';
        referees.forEach((ref) => {
            content += `${ref.firstName},${ref.lastName},${ref.shortName},${ref.country},${ref.email},${ref.firstName}`;
            content += `,${ref.gender},${ref.firstName},`;
            content += `"${ref.mobilePhones ? ref.mobilePhones : ''}"`;
            content += `,"${ref.speakingLanguages ? ref.speakingLanguages.join(',') : ''}"`;
            content += `,${ref.referee.refereeLevel},${ref.referee.refereeCategory}`;
            content += `,${ref.referee.nextRefereeLevel ? ref.referee.nextRefereeLevel : ''}\n`;
        });
        return content;
    }
}
export interface UserSearchCriteria {
    role?: AppRole;
    text?: string;
    region?: DataRegion;
    country?: string;
    refereeLevel?: RefereeLevel;
    refereeCoachLevel?: RefereeCoachLevel;
}
