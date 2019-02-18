import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Tag  = {name:string,count:number,selected:boolean}

@Pipe({
  name: 'sortTag'
})
export class SortTagPipe implements PipeTransform {

  transform(tags: Observable<Tag[]>, searchTerm: string): Observable<Tag[]> {
    return tags.pipe( map( tags => tags.sort( (a,b) => a.selected && !b.selected ? -1 : !a.selected && b.selected ? 1 : 0)));
  }

}
