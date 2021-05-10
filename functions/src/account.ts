import { User, ApplicationRole }  from './model/user';

export function computeRights(applications: ApplicationRole[], user: User) {
    const rights: string[] = [];
    if (applications.filter(an => an.name === 'RefereeCoach' && an.role === 'REFEREE_COACH').length > 0) {
        rights.push('Referee coach inside the referee coaching application <a href="https://coach.coachreferee.com">https://coach.coachreferee.com</a>');
    }
    if (applications.filter(an => an.name === 'RefereeCoach' && an.role === 'ADMIN').length > 0) {
        rights.push('Admin inside the referee coaching application <a href="https://coach.coachreferee.com">https://coach.coachreferee.com</a>');
    }

    if (applications.filter(an => an.name === 'Upgrade' && an.role === 'REFEREE').length > 0 && user.accountStatus === 'ACTIVE') {
        rights.push('Referee inside the referee upgrade application <a href="https://upgrade.coachreferee.com">https://upgrade.coachreferee.com</a>');
    }
    if (applications.filter(an => an.name === 'Upgrade' && an.role === 'NDR').length > 0) {
        rights.push('NDR of ' + user.country + ' inside the referee upgrade application <a href="https://upgrade.coachreferee.com">https://upgrade.coachreferee.com</a>');
    }
    if (applications.filter(an => an.name === 'Upgrade' && an.role === 'REFEREE_COACH').length > 0) {
        rights.push('Referee Coach ' + user.refereeCoach.refereeCoachLevel + ' inside the referee upgrade application <a href="https://upgrade.coachreferee.com">https://upgrade.coachreferee.com</a>');
    }
    return rights;
}