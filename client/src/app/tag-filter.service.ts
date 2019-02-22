import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Drop } from "./drop";
import { Tag } from "./tag";
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  dropsObservable = new Subject<Drop[]>();
  tagsObservable = new Subject<Tag[]>();
  allTags:Tag[];

  constructor(private fireService: FireService) {
    console.log("get drops with filters");
    this.fireService.colWithIds$("drops", ref => ref.orderBy("updatedAt","asc"))
      .subscribe( (drops:Drop[]) => this.dropsObservable.next(drops));
    this.fireService.colWithIds$("tags")
      .subscribe( (tags:Tag[]) => { 
        this.allTags = tags; 
        this.tagsObservable.next(tags) 
      });
}

  selectTag(tags: string[]) {
    if (tags.length == 0) {
      this.fireService.colWithIds$("drops", ref => ref.orderBy("updatedAt","asc")).subscribe( (drops:Drop[]) => this.dropsObservable.next(drops));
      this.tagsObservable.next(this.allTags);
    }
    if (tags.length >= 1) {
      this.fireService.colWithIds$("drops", ref => ref.where("tags","array-contains",tags[0]).orderBy("updatedAt","asc"))
      .pipe( map( (drops:Drop[]) => drops.filter( d => tags.every(t => d.tags.includes(t),this) )) )
      .subscribe((drops:Drop[]) => { 
        this.tagsObservable.next(this.allTags.filter( t => drops.some( d => d.tags.includes(t.name)) ) ); 
        this.dropsObservable.next(drops) 
      });
    }
  }

  tags():Observable<Tag[]> {
    return this.tagsObservable.asObservable();
  }

  drops():Observable<Drop[]> {
    return this.dropsObservable.asObservable();
  }
}
