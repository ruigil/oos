import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: any, args?: any): String {
    return moment().isSame(value,"day") ? moment(value).format('HH:mm') : 
    moment().isSame(value,"month") ? moment(value).format("ddd DD") : moment().isSame(value,"year") ? moment(value).format("ddd DD MMM") : moment(value).format("MMM YYYY");
    
  }

}
