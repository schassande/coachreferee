import { NavController } from '@ionic/angular';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, of, forkJoin } from 'rxjs';

import { RefereeCategory, Gender, Referee, RefereeLevel } from '../../../app/model/user';
import { RefereeService } from '../../../app/service/RefereeService';
import { ResponseWithData } from 'src/app/service/response';
import { UserService } from './../../../app/service/UserService';

import * as csv from 'csvtojson';

@Component({
  selector: 'app-referee-import',
  templateUrl: './referee-import.component.html',
  styleUrls: ['./referee-import.component.scss'],
})
export class RefereeImportComponent implements OnInit {

  @ViewChild('inputReferees') inputReferees: ElementRef;
  importedDatas: AnalysedImportReferee[] = [];
  analysisStatus: 'NONE' | 'ANALYSING' | 'ANALYSED' = 'NONE';
  importStatus: 'NONE' | 'IMPORTING' | 'IMPORTED' = 'NONE';
  nbToImport: 0;
  showImportButton = false;
  showNotImportedOnly = false;

  constructor(
    private navController: NavController,
    private refereeService: RefereeService,
    private userService: UserService
  ) { }

  ngOnInit() {}

  loadFile() {
    this.inputReferees.nativeElement.click();
  }

  importRefereeFromCsv(event) {
    this.analayse(event.target.files[0]);
  }

  private analayse(file) {
    this.analysisStatus = 'ANALYSING';
    this.importedDatas = [];
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      csv({ output: 'json', trim: true, noheader: false, delimiter: ',', ignoreEmpty: true, checkType: false})
        .fromString(reader.result as string).then((jsons) => {
          const obs: Observable<AnalysedImportReferee>[] = [of(null)];
          jsons.forEach( (json, idx) => {
            // console.log('json=' + JSON.stringify(json, null, 2));
            const importedData: AnalysedImportReferee = {
              readReferee : this.jsonToReferee(json),
              foundReferee: null,
              toImport: false,
              errors: [],
              lineNumber: idx + 2
            };
            // console.log('read=' + JSON.stringify(importedData.readReferee, null, 2));
            this.importedDatas.push(importedData);
            obs.push(this.analyseReferee(importedData));
          });
          forkJoin(obs).subscribe(() => {
            this.nbToImport = 0;
            this.importedDatas.forEach((impd) => {
              if (impd.toImport) {
                this.nbToImport ++;
              }
            });
            this.analysisStatus = 'ANALYSED';
            this.computesEnableImportButton();
            // console.log('Analysis completed');
          });
        });
    };
    reader.readAsText(file);
  }

  public computesEnableImportButton() {
    this.showImportButton = this.analysisStatus === 'ANALYSED'
      && this.importStatus !== 'IMPORTING'
      && this.importedDatas.filter((idata) => idata.toImport).length > 0;
  }

  private analyseReferee(importedData: AnalysedImportReferee): Observable<AnalysedImportReferee> {
    importedData.toImport = false; // initial value
    if (!importedData.readReferee) {
      importedData.errors.push('No data read');
      return of(importedData);
    }
    if (!importedData.readReferee.firstName || !importedData.readReferee.firstName.trim()) {
      importedData.errors.push('No first name');
    }
    if (!importedData.readReferee.lastName || !importedData.readReferee.lastName.trim()) {
      importedData.errors.push('No last name');
    }
    if (!importedData.readReferee.referee.refereeLevel || !importedData.readReferee.referee.refereeLevel.trim()) {
      importedData.errors.push('Valid referee level is missing');
    }
    if (importedData.errors.length > 0) {
      return of(importedData);
    }
    if (!importedData.readReferee.shortName || !importedData.readReferee.shortName.trim()) {
      // no short name => compute it from firstname and last name
      importedData.readReferee.shortName = this.userService.computeShortName(
        importedData.readReferee.firstName.trim(), importedData.readReferee.lastName.trim());
    }
    return this.refereeService.findByShortName(importedData.readReferee.shortName).pipe(
      map((rref) => {
        if (rref.data && rref.data.length > 0) {
          importedData.foundReferee = rref.data[0];
        }
        importedData.toImport = importedData.foundReferee == null;
        return importedData;
      }),
    );
  }

  private jsonToReferee(json): Referee {
    return {
      id: null,
      version: 0,
      creationDate : new Date(),
      lastUpdate : new Date(),
      dataStatus: 'NEW',
      firstName: this.getValue(json, 'firstName', ''),
      lastName: this.getValue(json, 'lastName', ''),
      shortName: this.getValue(json, 'shortName', ''),
      country: this.getValue(json, 'country', ''),
      email: this.getValue(json, 'email', ''),
      gender: this.getGender(json, 'gender', 'M'),
      mobilePhones: this.getStringList(json, 'mobilePhones', []),
      photo: {path: null, url: null},
      speakingLanguages: this.getStringList(json, 'speakingLanguages', ['EN']),
      referee : {
          refereeLevel: this.getRefereeLevel(json, 'refereeLevel', 'EURO_1'),
          refereeCategory : this.getRefereeCategory(json, 'OPEN'),
          nextRefereeLevel: this.getRefereeLevel(json, 'nextRefereeLevel', null),
      },
      refereeCoach: {
          refereeCoachLevel: 'NONE'
      },
      dataSharingAgreement: {
        personnalInfoSharing: 'NO',
        photoSharing: 'NO',
        refereeAssessmentSharing: 'NO',
        refereeCoachingInfoSharing: 'NO'
      }
    };
  }

  private getValue(json: any, fieldName: string, defaultValue: string): string {
    return json[fieldName] ? json[fieldName] : defaultValue;
  }

  private getGender(json: any, fieldName: string, defaultValue: Gender): Gender {
    return json[fieldName] ? json[fieldName] : defaultValue;
  }

  private getStringList(json: any, fieldName: string, defaultValue: string[]): string[] {
    if (json[fieldName]) {
      if (typeof json[fieldName] === 'string') {
        return json[fieldName].split(',').map((val) => val.trim());
      } else {
        console.log('getStringList(' + fieldName + '): ', json[fieldName], typeof [fieldName]);
        return [json[fieldName]];
      }
    } else {
      return defaultValue;
    }
  }

  private getRefereeLevel(json: any, fieldName: string, defaultValue: RefereeLevel): RefereeLevel {
    if (json.referee && json.referee[fieldName]) {
      return json.referee[fieldName] as RefereeLevel;
    } else if (json[fieldName]) {
      return json[fieldName] as RefereeLevel;
    } else {
      return defaultValue;
    }
  }

  public getRefereeCategory(json: any, defaultValue: RefereeCategory): RefereeCategory {
    if (json.referee && json.referee.refereeCategory) {
      return json.referee.refereeCategory as RefereeCategory;
    } else if (json.refereeCategory) {
      return json.refereeCategory as RefereeCategory;
    } else {
      return defaultValue;
    }
  }

  selectAll() {
    this.importedDatas.forEach( (idata) => idata.toImport = idata.errors.length === 0);
  }
  unselectAll() {
    this.importedDatas.forEach( (idata) => idata.toImport = false);
  }

  public importReferees() {
    const obs: Observable<ResponseWithData<Referee>>[] = [];
    this.importedDatas.forEach( (idata) => {
      if (idata.toImport) {
        obs.push(this.refereeService.save(idata.readReferee));
      }
    });
    if (obs.length) {
      this.importStatus = 'IMPORTING';
      forkJoin(obs).subscribe(() => {
        this.importStatus = 'IMPORTED';
        this.computesEnableImportButton();
        this.navController.navigateRoot('/referee/list');
      });
    }
  }
  showAll() {
    this.showNotImportedOnly = false;
  }

  showNotImported() {
    this.showNotImportedOnly = true;
  }
}

/**
 * Define the internal structure representing a referee to import
 */
export interface AnalysedImportReferee {
  /** The referee read from the import file */
  readReferee: Referee;
  /** the referee found from the database */
  foundReferee: Referee;
  /** flag indicating if the data can be imported */
  toImport: boolean;
  /** the list of error detected during the analysis or the imppor */
  errors: string[];
  /** The line number in the file */
  lineNumber: number;
}
