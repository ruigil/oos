import { Pipe, PipeTransform } from '@angular/core';
import { Marked } from '@ts-stack/markdown';

@Pipe({
  name: 'markdown'
})
export class MarkdownPipe implements PipeTransform {

  transform(value: string | undefined, args?: any): any {
    return value ? Marked.parse(value) : value;
  }

}
