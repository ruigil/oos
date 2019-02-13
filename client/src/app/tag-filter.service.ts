import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  tags: string[] = [];
  tagsObservable = new Subject<string[]>();

  constructor() {
  }

  tagSelection(tags: string[]) {
    this.tagsObservable.next(tags);
  }

  tagFilter():Observable<string[]> {
    return this.tagsObservable.asObservable();
  }
}
