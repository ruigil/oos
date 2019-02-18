import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

type Tag  = {name:string,count:number,selected:boolean}

@Pipe({
  name: 'searchTag'
})
export class SearchTagPipe implements PipeTransform {

  transform(tags: Observable<Tag[]>, searchTerm: string): Observable<Tag[]> {
    return tags.pipe( map( tags => tags.filter(t => t.name.includes(searchTerm)) ));
  }

}
