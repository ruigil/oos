import { Injectable } from '@angular/core';
import { Interval, addDays, addMonths, addWeeks, addYears, endOfDay, endOfMonth, endOfWeek, endOfYear, formatISO, subDays, isWithinInterval, startOfToday, format, isToday, subWeeks, subMonths, subYears } from 'date-fns';
import { User } from '../model/user';
import { OceanOSService } from './ocean-os.service';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

@Injectable({
    providedIn: 'root'
})
export class DateTimeService {

    user: User = new User( {
        settings: { 
            sys_day:true, 
            sys_timezone: "Europe/Zurich",
            currency: "CHF" ,
            preview: 'day' 
        }
    })

    constructor() { 
    }

    setSettings(user:User) {
        this.user = user;
    }

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
        // zone to utc
        if (typeof date === 'string') {
            return zonedTimeToUtc(new Date(date),this.user.settings.sys_timezone).getTime();
        } else {
            return zonedTimeToUtc(date,this.user.settings.sys_timezone).getTime();
        }
    }

    getDateISO(timestamp:number) {
        // utc to timezone
        return formatISO(utcToZonedTime(timestamp,this.user.settings.sys_timezone).getTime()).substring(0,19);
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
