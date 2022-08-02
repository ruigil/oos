import { Pipe, PipeTransform } from '@angular/core';
import { toDate, format, isToday } from 'date-fns';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: number | null, args?: any): String {

    return value ? isToday(value) ? format(value, "HH:mm") : format(value, 'eee, dd, MMM') : ""; 
    
    //moment().isSame(value,"day") ? moment(value).format('HH:mm') : 
    //moment().isSame(value,"month") ? moment(value).format("ddd DD") : moment().isSame(value,"year") ? moment(value).format("ddd DD MMM") : moment(value).format("MMM YYYY");
    
  }

}
