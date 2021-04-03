import { ConnectedUserService } from './../../../app/service/ConnectedUserService';
import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

import { Coaching } from '../../../app/model/coaching';
import { Competition, GameAllocation, AnalysedImport, AnalysedImportCompetition } from '../../../app/model/competition';
import { Referee, User } from '../../../app/model/user';

import { CoachingService } from '../../../app/service/CoachingService';
import { CompetitionService } from '../../../app/service/CompetitionService';
import { DateService } from '../../../app/service/DateService';
import { HelpService } from '../../../app/service/HelpService';
import { RefereeService } from '../../../app/service/RefereeService';
import { UserService } from '../../../app/service/UserService';
import { ResponseWithData } from '../../../app/service/response';

import * as csv from 'csvtojson';

@Component({
  selector: 'app-competition-import',
  templateUrl: './competition-import.component.html',
  styleUrls: ['./competition-import.component.scss'],
})
export class CompetitionImportComponent implements OnInit {

  @ViewChild('inputCompetition') inputCompetition: ElementRef;
  importedDatas: AnalysedImportCompetition = null;
  analysisStatus: 'NONE' | 'ANALYSING' | 'ANALYSED' = 'NONE';
  importStatus: 'NONE' | 'IMPORTING' | 'IMPORTED' = 'NONE';
  showImportButton = false;
  nbError = 0;
  updateExisting = true;
  removeUnreferenced = false;

  constructor(
    private coachingService: CoachingService,
    private competitionService: CompetitionService,
    private connectedUserService: ConnectedUserService,
    public dateService: DateService,
    private helpService: HelpService,
    private navController: NavController,
    private refereeService: RefereeService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.analysisStatus = 'NONE';
    this.importStatus = 'NONE';
    this.helpService.setHelp('competition-import');
  }

  loadFile() {
    this.inputCompetition.nativeElement.click();
  }

  importCompetitionFromCsv(event) {
    this.analayse(event.target.files[0]);
  }

  private analayse(file) {
    this.analysisStatus = 'ANALYSING';
    this.importedDatas = {
      id: null,
      dataToImport: null,
      dataFromDB: null,
      lineNumber: 0,
      errors: [],
      toImport: false,
      gameAnalysis : [],
      gameToImport: 0,
      refereeAnalysis: [],
      refereeToImport: 0,
      refereeCoachAnalysis: [],
      refereeCoachToImport: 0
    };
    const reader: FileReader = new FileReader();
    this.importedDatas.lineNumber = 1;
    reader.onloadend = () => {
      csv({ output: 'json', trim: true, noheader: false, delimiter: ',', ignoreEmpty: true, checkType: false})
        .fromString(reader.result as string).then(async (jsons) => {
          // console.log(jsons.length + ` lines to analyse.`);
          // tslint:disable-next-line:prefer-for-of
          for (let idx = 0; idx < jsons.length; idx++) {
            const json = jsons[idx];
            const lineNumber = ++this.importedDatas.lineNumber;
            // console.log(`analyse file line ${lineNumber}`);
            // console.log('json=' + JSON.stringify(json, null, 2));
            await this.analyseGame(json, lineNumber).toPromise();
          }
          if (this.updateExisting && this.removeUnreferenced
              && this.importedDatas.dataFromDB && this.importedDatas.dataFromDB.allocations) {
            for (let idx = 0; idx < this.importedDatas.dataToImport.allocations.length;) {
              const alloc = this.importedDatas.dataFromDB.allocations[idx];
              if (this.importedDatas.gameAnalysis.findIndex(ana => ana.id === alloc.id) >= 0) {
                // The game from the database has been analysed => next
                idx++;
              } else {
                // The game exists in database object but not in analysed game
                // => remove it
                this.importedDatas.dataToImport.allocations.splice(idx, 1);
              }
            }
          }
          this.nbError = this.getNbError();
          this.showImportButton = this.nbError === 0;
          this.analysisStatus = 'ANALYSED';
          console.log('Analysis completed:', JSON.stringify(this.importedDatas.dataToImport, null, 2));
        });
    };
    reader.readAsText(file);
  }

  private getNbError(): number {
    return this.importedDatas.errors.length
      + this.importedDatas.refereeAnalysis.filter( (a) => a.errors.length > 0).length
      // Do not count coach error
      + this.importedDatas.gameAnalysis.filter( (a) => a.errors.length > 0).length;
  }


  private analyseGame(jsonGame, lineNumber: number): Observable<AnalysedImport<GameAllocation>> {
    // console.log(`analyseGame(${lineNumber})`);
    let iag: AnalysedImport<GameAllocation> = null;
    return this.analyseCompetition(jsonGame, lineNumber).pipe(
      map(() => {
        iag = this.newAnalysedImportGameAllocation(lineNumber);
        // check Game Id
        if (!jsonGame.gameId || !jsonGame.gameId.trim()) {
          iag.errors.push('The game id is missing.');
        } else {
          iag.id = jsonGame.gameId.trim();
          // check if the game id is not already used
          const iags = this.importedDatas.gameAnalysis.filter((ga) => ga.id === iag.id);
          if (iags.length) {
            iag.errors.push(`The game line ${iag.lineNumber} has the same identifier ${iag.id} than the game line ${iags[0].lineNumber}`);
          }
        }
        if (iag.id) {
          // the game has an id, try to find if it matches an existing game
          const dbAllocIdx = this.importedDatas.dataFromDB.allocations.findIndex( (alloc) => alloc.id === iag.id);
          if (dbAllocIdx >= 0) {
            iag.dataFromDB =  this.importedDatas.dataToImport.allocations[dbAllocIdx];
          }
          const impAllocIdx = this.importedDatas.dataToImport.allocations.findIndex( (alloc) => alloc.id === iag.id);
          if (this.updateExisting && impAllocIdx >= 0) {
            // share the same GameAllocation with the imported competition object
            iag.dataToImport = this.importedDatas.dataToImport.allocations[impAllocIdx];
          } else {
            // Create a new GameAllocation
            iag.dataToImport = this.newGameAllocation(iag.id);
          }
        } else {
          iag.dataToImport = this.newGameAllocation();
          this.importedDatas.dataToImport.allocations.push(iag.dataToImport);
        }
        // import other attributes
        this.analyseGameAttributes(jsonGame, iag);
        // Store the analysis in global objet
        this.importedDatas.gameAnalysis.push(iag);
        return iag;
      }),
      map( () => iag.dataToImport.referees = [] ), // clean the referees of the game
      flatMap(() => this.analyseReferee(jsonGame.referee1, iag)),
      flatMap(() => this.analyseReferee(jsonGame.referee2, iag)),
      flatMap(() => this.analyseReferee(jsonGame.referee3, iag)),
      flatMap(() => this.analyseRefereeCoach(jsonGame.refereeCoach1, iag, 0)),
      flatMap(() => this.analyseRefereeCoach(jsonGame.refereeCoach2, iag, 1)),
      flatMap(() => this.analyseRefereeCoach(jsonGame.refereeCoach3, iag, 2)),
      map(() => iag)
    );
  }

  private newGameAllocation(id: string = null): GameAllocation {
    return {
      id: null,
      date: new Date(),
      field: '1',
      timeSlot: '00:00',
      gameCategory: 'OPEN',
      gameSpeed: 'Medium',
      gameSkill: 'Medium',
      referees: [],
      refereeCoaches: []
    };
  }
  private cloneGameAllocation(src: GameAllocation): GameAllocation {
    return {
      date: src.date,
      field: src.field,
      gameCategory: src.gameCategory,
      gameSkill: src.gameSkill,
      gameSpeed: src.gameSpeed,
      id : src.id,
      timeSlot : src.timeSlot,
      referees: src.referees.map((item) =>  {
        return {  refereeId: item.refereeId, refereeShortName: item.refereeShortName };
      }),
      refereeCoaches: src.refereeCoaches.map((item) =>  {
        return {
          coachId: item.coachId,
          coachShortName: item.coachShortName,
          coachingId: item.coachingId };
      })
    };
  }

  private cloneCompetition(src: Competition): Competition {
    return {
      allocations: src.allocations.map((item: GameAllocation) => this.cloneGameAllocation(item)),
      name: src.name,
      date: src.date,
      year: src.year,
      region: src.region,
      country: src.region,
      ownerId: src.ownerId,
      referees: src.referees.map((item) =>  {
        return {  refereeId: item.refereeId, refereeShortName: item.refereeShortName };
      }),
      refereeCoaches: src.refereeCoaches.map((item) =>  {
        return {
          coachId: item.coachId,
          coachShortName: item.coachShortName };
      }),
      id: src.id,
      creationDate: src.creationDate,
      version: src.version,
      lastUpdate: src.lastUpdate,
      dataStatus: src.dataStatus
    };
  }

  private analyseCompetition(jsonGame, lineNumber: number): Observable<AnalysedImportCompetition> {
    // console.log(`analyseCompetition(${lineNumber})`);
    if (!jsonGame.competition || !jsonGame.competition.trim()) {
      this.importedDatas.errors.push('Competition name is missing on line ' + lineNumber);
      throw null;
    }
    if (this.importedDatas.dataToImport) {
      // the competition has been already set => compare it is the same name
      if (this.importedDatas.dataToImport.name !== jsonGame.competition) {
        this.importedDatas.errors.push('Different competition name on line ' + lineNumber);
        throw null;
      }
      // console.log(`analyseCompetition(${lineNumber}): the competition has been already set`);
      return of(this.importedDatas);
    } else {
      // console.log(`analyseCompetition(${lineNumber}): the competition has not been already set`);
      // it should be the first line of the file
      // => search the competition from the DB
      return this.competitionService.getCompetitionByName(jsonGame.competition).pipe(
        map((rcomp) => {
          this.importedDatas.dataFromDB = rcomp.data;
          if (this.importedDatas.dataFromDB) {
            console.log(`analyseCompetition(${lineNumber}): the competition found from DB: ${this.importedDatas.dataFromDB.id}`);
            this.importedDatas.dataToImport = this.cloneCompetition(this.importedDatas.dataFromDB);
          } else {
            console.log(`analyseCompetition(${lineNumber}): the competition does not exist`);
            this.importedDatas.dataToImport = this.newCompetition(jsonGame.competition);
          }
          return this.importedDatas;
        })
      );
    }
  }

  private newCompetition(name): Competition {
    return {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      name,
      ownerId: this.connectedUserService.getCurrentUser().id,
      date: new Date(),
      year: new Date().getFullYear(),
      region : 'Others',
      country : '',
      referees: [],
      refereeCoaches: [],
      allocations: []
    };
  }

  private analyseReferee(refereeShortName: string, iag: AnalysedImport<GameAllocation>): Observable<any> {
    // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}`);
    if (!refereeShortName || !refereeShortName.trim()) {
        return of('');
    }
    const competitionRefs = this.importedDatas.dataToImport.referees.filter((refe) => refe.refereeShortName === refereeShortName);
    if (competitionRefs.length) {
      // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}: Referee already in competition (1)`);
      const gameRefs = iag.dataToImport.referees.filter((refe) => refe.refereeShortName === refereeShortName );
      if (gameRefs.length === 0) {
        iag.dataToImport.referees.push(competitionRefs[0]);
      }
      return of('');
    }
    const ref = {refereeShortName: refereeShortName.trim(), refereeId: null};
    iag.dataToImport.referees.push(ref);
    this.importedDatas.dataToImport.referees.push(ref);
    // search if the referee has been already found
    const refAnas: AnalysedImport<Referee>[] = this.importedDatas.refereeAnalysis.filter(
      (refAna) => refAna.id === refereeShortName);
    if (refAnas.length === 0) {
      // It is the first time this referee is allocation on a game
      const refAna: AnalysedImport<Referee> = {
        id: ref.refereeShortName,
        dataToImport: null,
        dataFromDB: null,
        lineNumber: iag.lineNumber,
        errors: [],
        toImport: false
      };
      this.importedDatas.refereeAnalysis.push(refAna);
      return this.refereeService.findByShortName(ref.refereeShortName).pipe(
        map((rref) => {
          if (rref.data.length) {
            refAna.dataFromDB = rref.data[0];
            ref.refereeId = refAna.dataFromDB.id;
            // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}: Referee exists (1)`);
          } else {
            refAna.errors.push(`Referee ${refereeShortName} does not exist (line ${iag.lineNumber}).`);
            // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}: the referee does not exists (1)`);
          }
        })
      );
    } else if (refAnas[0].dataFromDB) {
      // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}: Referee exists (2)`);
      // the referee has been already found and the referee already exists
      ref.refereeId = refAnas[0].dataFromDB.id;
    } else {
      // console.log(`analyseReferee(${refereeShortName}) line: ${iag.lineNumber}: the referee does not exists (2)`);
      // The referee does not exist but it is not the first the problem is detected
      refAnas[0].errors.push(`Referee ${refereeShortName} does not exist (line ${iag.lineNumber}).`);
    }
    return of('');
  }

  /**
   * Analyses a referee coach
   * @param refereeCoachShortName the short name of the referee coach
   * @param iag the game analysis
   * @param coachIdx the idx of the coach in the game
   */
  private analyseRefereeCoach(refereeCoachShortName: string, iag: AnalysedImport<GameAllocation>, coachIdx: number): Observable<any> {
    // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber}`);
    if (!refereeCoachShortName || !refereeCoachShortName.trim()) {
      // no coach specified
      if (coachIdx < iag.dataToImport.refereeCoaches.length) {
        // Clean the element
        iag.dataToImport.refereeCoaches[coachIdx].coachShortName = null;
        iag.dataToImport.refereeCoaches[coachIdx].coachId = null;
      }
      return of('');
    }

    // Here a caoach has been specified
    const coach = { coachShortName: refereeCoachShortName.trim(), coachId: null, coachingId: null};

    const competitionCoaches = this.importedDatas.dataToImport.refereeCoaches.filter((c) => c.coachShortName === refereeCoachShortName);
    if (competitionCoaches.length) {
      // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber}: Referee Coach already in competition (1)`);
      // get coachId from previous analysis
      coach.coachId = competitionCoaches[0].coachId;
    }
    if (coachIdx < iag.dataToImport.refereeCoaches.length) {
      // fetch the coachingId from previous version
      coach.coachingId = iag.dataToImport.refereeCoaches[coachIdx].coachingId;
      // replace it from the game
      iag.dataToImport.refereeCoaches[coachIdx] = coach;
    } else {
      // add it into the game
      iag.dataToImport.refereeCoaches.push(coach);
    }
    if (competitionCoaches.length === 0) {
      // add the coach to the competition
      this.importedDatas.dataToImport.refereeCoaches.push(coach);
    }
    return this.manageCoachAnalysis(refereeCoachShortName, iag, coach);
  }

  /**
   * Create if required the analysis of the coach in the competition
   * @param refereeCoachShortName the name of the short name
   * @param iag the imported game
   * @param coach the coach
   */
  private manageCoachAnalysis(refereeCoachShortName: string, iag: AnalysedImport<GameAllocation>, coach): Observable<any> {
    // search if the coach has been already found
    const coachAnas: AnalysedImport<User>[] = this.importedDatas.refereeCoachAnalysis.filter(
      (coachAna) => coachAna.id === refereeCoachShortName);
    if (coachAnas.length === 0) {
      // It is the first time this coach is allocation on a game
      const coachAna: AnalysedImport<User> = {
        id: coach.coachShortName,
        dataToImport: null,
        dataFromDB: null,
        lineNumber: iag.lineNumber,
        errors: [],
        toImport: false
      };
      return this.userService.findByShortName(coach.coachShortName).pipe(
        map((ruser: ResponseWithData<User[]>) => {
          if (ruser.data.length) {
            coachAna.dataFromDB = ruser.data[0];
            coach.coachId = coachAna.dataFromDB.id;
            // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber} coach exists (1).`);
          } else {
            coachAna.errors.push(`Coach ${refereeCoachShortName} is not a known user of the application (line ${iag.lineNumber}).`);
            // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber} coach does not exist (1).`);
          }
          this.importedDatas.refereeCoachAnalysis.push(coachAna);
        })
      );
    } else if (coachAnas[0].dataFromDB) {
      // the referee has been already found and the referee already exist
      coach.coachId = coachAnas[0].dataFromDB.id;
      // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber} coach exists (2).`);
    } else {
      // The referee does not exist but it is not the first the problem is detected
      coachAnas[0].errors.push(`Coach ${refereeCoachShortName} is not a known user of the application (line ${iag.lineNumber}).`);
      // console.log(`analyseRefereeCoach(${refereeCoachShortName}) line: ${iag.lineNumber} coach does not exist (2).`);
    }
    return of('');
  }

  private newAnalysedImportGameAllocation(lineNumber: number): AnalysedImport<GameAllocation> {
    return {
      id: null,
      dataToImport: null,
      dataFromDB: null,
      lineNumber,
      errors: [],
      toImport: true
    };
  }

  private analyseGameAttributes(jsonGame: any, iag: AnalysedImport<GameAllocation>) {
    // console.log(`analyseGameAttributes() line: ${iag.lineNumber}`);

    if (!jsonGame.field || !jsonGame.field.trim()) {
      iag.errors.push('The game field number is missing.');
    } else {
      iag.dataToImport.field = jsonGame.field.trim();
    }

    if (!jsonGame.timeSlot || !jsonGame.timeSlot.trim()) {
      iag.errors.push('The game timeSlot is missing.');
    } else {
      iag.dataToImport.timeSlot = jsonGame.timeSlot.trim();
    }
    if (jsonGame.category && jsonGame.category.trim()) {
      iag.dataToImport.gameCategory = jsonGame.category.trim();
    }

    if (!jsonGame.date || !jsonGame.date.trim()) {
      iag.errors.push('The game date is missing.');
    } else {
      try {
        const str: string = jsonGame.date.trim().replace('/', '-').replace('/', '-').replace('\\', '-').replace('\\', '-');
        const res = this.dateService.string2date(str, iag.dataToImport.date);
        if (res instanceof Date) {
          // console.log(`dateService.string2date(${str})=> ${res}    OK`);
          iag.dataToImport.date = res as Date;
        } else {
          // console.log(`dateService.string2date(${str})=> ${res}    ERROR`);
          iag.errors.push(res);
        }
      } catch (err) {
        iag.errors.push(err);
      }
    }
  }

  importCompetition() {
    let obs: Observable<any> = of('');
    if (!this.importedDatas.dataToImport.id) {
      this.importedDatas.dataToImport.id = this.competitionService.createId();
    }
    this.importedDatas.gameAnalysis.forEach((ana) => {
      ana.dataToImport.refereeCoaches.forEach((refco) => {
        if (refco.coachingId) {
          obs = obs.pipe(flatMap(() => this.updateCoaching(ana, refco)));
        } else if (refco.coachId && refco.coachShortName) {
          obs = obs.pipe(flatMap(() => this.createCoaching(ana, refco)));
        }
      });
    });
    obs = obs.pipe(flatMap(() => this.competitionService.save(this.importedDatas.dataToImport)));
    obs.subscribe((rcomp) => {
      if (rcomp.data) {
        this.navController.navigateRoot(`/competition/edit/${rcomp.data.id}`);
      } else {
        // TODO show import error
      }
    });
  }
  /**
   * Checks the coaching has at least one feedback or at least positive feedbacks.
   */
  coachingStarted(coaching: Coaching): boolean {
    return coaching.referees.filter((ref) => ref.positiveFeedbacks.length > 0 || ref.feedbacks.length > 0).length > 0;
  }
  updateCoaching(ana: AnalysedImport<GameAllocation>,
                 refco: {coachId: string, coachShortName: string, coachingId: string}): Observable<any> {
    return this.coachingService.get(refco.coachingId).pipe(
      flatMap((rcoaching) => {
        if (!rcoaching.data) {
          if (refco.coachId) {
            // the coaching does not exist any more, than re create it
            return this.createCoaching(ana, refco);
          } else {
            return of('');
          }
        }
        // coaching really exists.
        const coachingStarted = this.coachingStarted(rcoaching.data);
        if (!refco.coachId || !refco.coachShortName) {
          // no more coach on this game
          if (!coachingStarted) {
            // delete the coaching beacause it is not already started
            return this.coachingService.delete(refco.coachingId);
          } else {
            return of('');
          }
        } else if (rcoaching.data.coachId !== refco.coachId) {
          // it is not the same coach => create a new coaching for the right coach
          let obs: Observable<any> = this.createCoaching(ana, refco);
          if (!coachingStarted) {
            // delete the coaching beacause it is not already started
            obs = obs.pipe(flatMap(() => this.coachingService.delete(refco.coachingId)));
          }
          return obs;
        } else if (coachingStarted) {
          // The coaching already started => let it
          return of('');
        } else {
          // replace values
          rcoaching.data.competitionId = this.importedDatas.dataToImport.id;
          rcoaching.data.competition = this.importedDatas.dataToImport.name;
          rcoaching.data.date = ana.dataToImport.date;
          rcoaching.data.field = ana.dataToImport.field;
          rcoaching.data.timeSlot = ana.dataToImport.timeSlot;
          rcoaching.data.gameCategory = ana.dataToImport.gameCategory;
          rcoaching.data.gameSpeed = ana.dataToImport.gameSpeed;
          rcoaching.data.gameSkill = ana.dataToImport.gameSkill;
          this.setReferees(rcoaching.data, ana);
          return this.coachingService.save(rcoaching.data);
        }
      })
    );
  }
  createCoaching(ana: AnalysedImport<GameAllocation>,
                 refco: {coachId: string, coachShortName: string, coachingId: string}): Observable<any> {
      const coaching: Coaching = {
        id: null,
        version: 0,
        creationDate: new Date(),
        lastUpdate: new Date(),
        dataStatus: 'NEW',
        sharedWith:  { users: [], groups: []},
        importGameId: ana.dataToImport.id,
        competition: this.importedDatas.dataToImport.name,
        competitionId: this.importedDatas.dataToImport.id,
        date: ana.dataToImport.date,
        field: ana.dataToImport.field,
        timeSlot: ana.dataToImport.timeSlot,
        coachId: refco.coachId,
        gameCategory: ana.dataToImport.gameCategory,
        gameSpeed: ana.dataToImport.gameSpeed,
        gameSkill: ana.dataToImport.gameSkill,
        closed: false,
        currentPeriod: 1,
        refereeIds: [],
        referees: [],
      };
      this.setReferees(coaching, ana);

      return this.coachingService.save(coaching).pipe(
      map((rcoaching) => {
        if (rcoaching.data) {
          refco.coachingId = rcoaching.data.id;
        }
      })
    );
  }
  private setReferees(coaching: Coaching, ana: AnalysedImport<GameAllocation>) {
    coaching.refereeIds = [];
    coaching.referees = [];
    ana.dataToImport.referees.forEach((ref) => {
      coaching.refereeIds.push(ref.refereeId);
      coaching.referees.push({
        refereeId: ref.refereeId,
        refereeShortName: ref.refereeShortName,
        feedbacks: [],
        positiveFeedbacks: [],
        upgrade: null,
        rank: 0
      });
    });
  }

  isNewCoach(coachId): boolean {
    return this.importedDatas.dataFromDB
      && this.importedDatas.dataFromDB.refereeCoaches.filter((refco) => refco.coachId === coachId).length === 0;
  }
}

