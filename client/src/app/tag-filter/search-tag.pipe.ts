import { Pipe, PipeTransform } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map  } from 'rxjs/operators';

type Tag  = {name:string,count:number,selected:boolean}

@Pipe({
  name: 'searchTag'
})
export class SearchTagPipe implements PipeTransform {

  transform(tags: Observable<Tag[]>, searchTerm: Observable<string>): Observable<Tag[]> {
    return combineLatest(tags,searchTerm).pipe( map( ([tags, term]) => tags.filter( t => t.name.toUpperCase().includes(term.toUpperCase()) ) ));
  }

}
