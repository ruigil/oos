import { Pipe, PipeTransform } from '@angular/core';
import { formatDistance } from 'date-fns';

@Pipe({
  name: 'timeago'
})
export class TimeagoPipe implements PipeTransform {

  transform(value: number, args?: any): string {
    return `${formatDistance(value,Date.now())} ago`; 
  }

}
