import { Pipe, PipeTransform } from '@angular/core';
import { format, parse } from 'date-fns';


@Pipe({
  name: 'iso8601'
})
export class Iso8601Pipe implements PipeTransform {

  transform(timestamp: any, args?: any): any {
    return format(timestamp.toDate(),"YYYY-MM-DDTHH:mm");
  }

}
