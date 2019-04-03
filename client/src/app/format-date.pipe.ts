import { Pipe, PipeTransform } from '@angular/core';
import { format, parse, isToday } from 'date-fns';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, args?: any): String {
    return isToday(value) ? format(value,'HH:mm') : format(value, "ddd DD/MM HH:mm");
  }

}
