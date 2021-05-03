import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class ToolService {

    getValue(anArray: string[][], key: string): string {
        const result: string[][] = anArray.filter((line: string[]) => line[0] === key);
        return result.length === 0 ? null : result[0][1];
    }
    getValues(anArray: string[][], keys: string[]): string[] {
        const result: string[][] = anArray.filter((line: string[]) => keys.filter( (key) => line[0] === key).length > 0);
        return result.length === 0 ? null : result.map((line) => line[1]);
    }

    addToSetById(arrays: any[], itemToAdd: any, idFieldName: string = 'id') {
        const idx = arrays.findIndex( (item) => itemToAdd[idFieldName] === item[idFieldName]);
        if (idx < 0) {
            arrays.push(itemToAdd);
        }
    }

    deleteFromArrayById(arrays: any[], id: string, idFieldName: string = 'id') {
        const idx = arrays.findIndex( (item) => id === item[idFieldName]);
        if (idx >= 0) {
          arrays.splice(idx, 1);
        }
    }

    runObservableInSequence(obsArray: Observable<boolean>[], idx = 0): Observable<any> {
        return obsArray[idx].pipe(
            mergeMap((continu) => {
                if (continu && obsArray.length > idx + 1) {
                    return this.runObservableInSequence(obsArray, idx + 1);
                } else {
                    return of(false);
                }
            })
        );
    }
    isValidString(str: string, minimalLength: number = 0, maximalLength: number = 100): boolean {
        return str && str.trim().length >= minimalLength && str.trim().length <= maximalLength;
    }
}
