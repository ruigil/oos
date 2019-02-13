import { Pipe, PipeTransform } from '@angular/core';

type Tag  = {name:string,count:number,selected:boolean}

@Pipe({
  name: 'searchTag'
})
export class SearchTagPipe implements PipeTransform {

  transform(tags: Tag[], searchTerm: string): Tag[] {
    return tags.filter( t => t.name.includes(searchTerm));
  }

}
