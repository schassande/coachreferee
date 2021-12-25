import { Injectable } from '@angular/core';
import * as moment from 'moment';

const DATE_SEP = '-';
const TIME_SEP = ':';

@Injectable()
export class DateService {

  public compareDate(day1: Date, day2: Date): number {
    // Compare date
    let res: number = day1.getFullYear() - day2.getFullYear();
    if (res === 0) {
      res = day1.getMonth() - day2.getMonth();
      if (res === 0) {
        res = day1.getDate() - day2.getDate();
      }
    }
    return res;
  }

  public isToday(day: Date): boolean {
    return this.compareDate(day, new Date()) === 0;
  }

  public date2string(aDate: Date) {
    return aDate.getFullYear()
      + DATE_SEP + this.to2Digit(aDate.getMonth() + 1)
      + DATE_SEP + this.to2Digit(aDate.getDate());
  }

  public time2string(aDate: Date) {
    return this.to2Digit(aDate.getHours())
      + TIME_SEP + this.to2Digit(aDate.getMinutes());
  }

  public datetime2string(aDate: Date) {
    return this.date2string(aDate) + ' ' + this.time2string(aDate);
  }
  public string2date(dateStr: string, aDate: Date): Date {
    const elements = dateStr.split(DATE_SEP);
    if (!aDate) {
        aDate = new Date();
    }
    aDate.setFullYear(Number.parseInt(elements[0], 0));
    aDate.setMonth(Number.parseInt(elements[1], 0) - 1);
    aDate.setDate(Number.parseInt(elements[2], 0));
    return aDate;
  }

  public to2Digit(nb: number): string {
    return (nb < 10 ? '0' : '') + nb;
  }
  public nextDay(date: Date): Date {
    return moment(date.getTime()).add(1, 'days').toDate();
  }

  public to00h00(day: Date): Date {
    day.setUTCMinutes(0);
    day.setUTCSeconds(0);
    day.setUTCHours(0);
    day.setUTCMilliseconds(0);
    return day;
  }
}
