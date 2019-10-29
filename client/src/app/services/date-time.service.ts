import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateTimeService {

    constructor() { }

    getDateTime(date) {
        return { date: date, time: date.getHours()+":"+date.getMinutes() }
    }

    getDate(dateTime) {
        let hm = dateTime.time.split(":");
        return moment(dateTime.date).hours(hm[0]).minutes(hm[1]).toDate();
    }

    getRecurrences() {
    return [ 
        { value: "none", text: "None"}, 
        { value: "day", text: "Daily"}, 
        { value: "week", text: "Weekly"}, 
        { value: "month", text: "Monthly"}, 
        { value: "year", text: "Yearly"},
        { value: "weekday", text: "Weekdays"},
        { value: "weekend", text: "Weekends"}
    ]
    }

    getTimestamp(time: string): any {
        let m = moment().endOf('day');
        return time == "week" ? this.date2ts(moment(m).add(1,"weeks").toDate()) :
        time == "month" ? this.date2ts(moment(m).add(1,"months").toDate()) :
        time == "year" ? this.date2ts(moment(m).add(1,"years").toDate()) :this.date2ts(m.toDate()); // today 
    }

    date2ts(date): firebase.firestore.Timestamp {
        return firebase.firestore.Timestamp.fromDate(date);
    }


}
