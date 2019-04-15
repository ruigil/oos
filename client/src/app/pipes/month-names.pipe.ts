import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthNames'
})
export class MonthNamesPipe implements PipeTransform {

  transform(value: number, args?: any): string {
      const months = ["January","February","March","April","May","June","July","August","September","Octobre","November","December"]
        return months[value-1];
  }

}
