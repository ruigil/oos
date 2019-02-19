import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Drop } from "./drop";
import { Tag } from "./tag";
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  private selectedTags: string[] = [];
  dropsObservable = new Subject<Drop[]>();
  tagsObservable = new Subject<Tag[]>();
  selectObservable = new Subject();

  constructor(private fireService: FireService) {
  }

  selectTag(tags: string[]) {
    //this.dropsObservable.next(tags);
    this.selectedTags = tags;
    this.selectObservable.next(tags);
  }

  select(): Observable<any> {
    return this.selectObservable.asObservable();
  }

  tags():Observable<Tag[]> {
    return this.fireService.colWithIds$("tags");
  }

  drops():Observable<Drop[]> {
      console.log("get drops with filters");
      if (this.selectedTags[0]) 
        return this.fireService.colWithIds$("drops", ref => ref.where("tags","array-contains",this.selectedTags[0]).orderBy("updatedAt","asc"));
      else 
        return this.fireService.colWithIds$("drops", ref => ref.orderBy("updatedAt","asc"));
    }
}
