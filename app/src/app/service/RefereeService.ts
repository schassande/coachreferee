import { Observable, of } from 'rxjs';
import { Response, ResponseWithData } from './response';
import { Injectable } from '@angular/core';
import { Referee, User } from './../model/user';
import { PersistentDataFilter } from './PersistentDataFonctions';
import { UserService } from './UserService';
import { ConnectedUserService } from './ConnectedUserService';

@Injectable()
export class RefereeService {

    public lastSelectedReferee: { referee: Referee, idx: number} = {referee: null, idx: -1};

    constructor(
        private connectedUserService: ConnectedUserService,
        private userService: UserService) {}
    public preload(): Observable<Response>{
        return of({error: null});
    }
    public get(id: string): Observable<ResponseWithData<Referee>> {
        return this.userService.get(id);
    }
    public save(referee: Referee): Observable<ResponseWithData<Referee>> {
        if (referee.dataStatus === 'NEW') {
            const user: User = referee as User;
            user.password = '-';
            user.accountId = '-';
            user.token = '-';
            user.defaultCompetition = '-';
            user.defaultCompetitionId = '-';
            user.defaultGameCatory = 'OPEN';
            user.dataSharingAgreement = {
              personnalInfoSharing: 'YES',
              photoSharing: 'YES',
              refereeAssessmentSharing: 'YES',
              refereeCoachingInfoSharing: 'YES',
              coachAssessmentSharing: 'YES',
              coachCoachingInfoSharing: 'YES',
              coachProSharing: 'YES'
            };
            user.region = this.connectedUserService.getCurrentUser().region;
            user.applications = [
                {name: 'RefereeCoach', role: 'REFEREE'},
                {name: 'Upgrade', role: 'REFEREE'}];
            user.demandingApplications = [];
            user.groupIds = [];
            user.authProvider = 'EMAIL';
            user.accountStatus = 'NO_ACCOUNT';
            // console.log(JSON.stringify(user, null, 2));
        }
        return this.userService.save(referee as User);
    }
    public delete(id: string): Observable<Response> {
        return this.userService.delete(id);
    }
    public all(): Observable<ResponseWithData<Referee[]>> {
        return this.userService.searchReferees();
    }

    public findByShortName(shortName: string): Observable<ResponseWithData<Referee[]>> {
        return this.userService.findByShortName(shortName);
    }

    public searchReferees(text: string): Observable<ResponseWithData<Referee[]>> {
        return this.userService.searchReferees(text);
    }

    public getFilterByText(text: string): PersistentDataFilter<Referee> {
        const validText = text && text !== null  && text.trim().length > 0 ? text.trim() : null;
        return validText === null ? null : (referee: Referee) => {
            return this.userService.stringContains(validText, referee.shortName)
                || this.userService.stringContains(validText, referee.firstName)
                || this.userService.stringContains(validText, referee.lastName);
        };
    }
    public getFilterByShortName(text: string): PersistentDataFilter<Referee> {
        const validText = text && text !== null  && text.trim().length > 0 ? text.trim() : null;
        return validText === null ? null : (referee: Referee) => validText === referee.shortName;
    }

    public listToCSV(referees: Referee[]): string {
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
