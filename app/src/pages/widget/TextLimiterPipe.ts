import { Pipe, PipeTransform } from '@angular/core';
/** Limits a text to a number of character */
@Pipe({name: 'textLimiter'})
export class TextLimiterPipe implements PipeTransform {
  transform(value: string, limit : number): string {
    return value && value.length > limit ? value.substring(0, limit).trim() : value;
  }
}