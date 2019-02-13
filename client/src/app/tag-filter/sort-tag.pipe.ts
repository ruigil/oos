import { Pipe, PipeTransform } from '@angular/core';

type Tag  = {name:string,count:number,selected:boolean}

@Pipe({
  name: 'sortTag'
})
export class SortTagPipe implements PipeTransform {

  transform(tags: Tag[], searchTerm: string): Tag[] {
    return tags.sort( (a,b) => a.selected && !b.selected ? -1 : !a.selected && b.selected ? 1 : 0)
  }

}
