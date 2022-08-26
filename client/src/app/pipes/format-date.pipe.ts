import { Pipe, PipeTransform } from '@angular/core';
import { toDate, format, isToday } from 'date-fns';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: number | null, args?: any): String {
    return value ? isToday(value) ? format(value, "HH:mm") : format(value, 'eee, dd, MMM') : ""; 
    
  }

}
