import { Pipe, PipeTransform } from '@angular/core';
import * as converter from 'showdown';

@Pipe({
  name: 'showdown'
})
export class ShowdownPipe implements PipeTransform {

  conv = new converter.Converter();

  transform(value: string, args?: any): any {
    return this.conv.makeHtml(value);
  }

}
