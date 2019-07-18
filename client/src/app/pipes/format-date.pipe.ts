import { Pipe, PipeTransform } from '@angular/core';
import { format, parse, isToday, isThisWeek, isThisMonth, isBefore, addWeeks } from 'date-fns';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, args?: any): String {
    return isToday(value) ? format(value,'HH:mm') : isBefore(value,addWeeks(value,1)) ? format(value, "ddd DD") : isThisMonth(value) ? format(value, "ddd DD MMM") : format(value, "DD MMM");
  }

}
