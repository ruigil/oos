import { Injectable } from '@angular/core';
import { Interval, addDays, addMonths, addWeeks, addYears, endOfDay, endOfMonth, endOfWeek, endOfYear, formatISO, subDays, isWithinInterval, startOfToday, format, isToday, subWeeks, subMonths, subYears } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

    constructor() { }

    getRecurrences() {
        return [ 
            { key: "none", value: "None"}, 
            { key: "day", value: "Daily"}, 
            { key: "week", value: "Weekly"}, 
            { key: "month", value: "Monthly"}, 
            { key: "year", value: "Yearly"},
            { key: "weekday", value: "Weekdays"},
            { key: "weekend", value: "Weekends"}
        ]
    }

    getTimestamp(date: Date | string): number {
        if (typeof date === 'string') {
            return new Date(date).getTime();
        } else {
            return date.getTime();
        }
    }

    getDateISO(timestamp:number) {
        return formatISO(timestamp).substring(0,19);
    }

    addDay(date: number, count = 1): number {
        return addDays(date, count).getTime();
    }
    addWeek(date: number, count = 1): number {
        return addWeeks(date, count).getTime();
    }
    addMonth(date: number, count = 1): number {
        return addMonths(date, count).getTime();
    }
    addYear(date: number, count = 1): number {
        return addYears(date, count).getTime();
    }
/*
    subDay(date: number, count = 1): number {
        return subDays(date, count).getTime();
    }
    subWeek(date: number, count = 1): number {
        return subWeeks(date, count).getTime();
    }
    subMonth(date: number, count = 1): number {
        return subMonths(date, count).getTime();
    }
    subYear(date: number, count = 1): number {
        return subYears(date, count).getTime();
    }
*/
    isWithin(d:number, interval: Interval):boolean {
        return isWithinInterval(d, interval);
    }

    isToday(date:number) {
        return isToday(date);
    }

    startOfToday():number {
        return startOfToday().getTime();
    }

    format(date:number, options:string):string {
        return format(date, options);
    }


}
