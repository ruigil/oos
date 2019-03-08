import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'newLine'
})
export class NewLinePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    return value ? value.replace(/\r?\n/g, "<br />") : "";
  }

}
