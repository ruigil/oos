import { Injectable } from '@angular/core';
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


}
