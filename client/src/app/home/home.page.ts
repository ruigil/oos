import { format, parse } from 'date-fns';
import { Component } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { TagFilterService } from '../tag-filter.service';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ id: string, date: string, note: string; icon: string }> = [];

  constructor(private dropsService: FireService, private tagFilterService: TagFilterService) {

    this.tagFilterService.tagFilter().subscribe( filters => {
      console.log("home filters");
      console.log(filters);
    });
    this.dropsService.colWithIds$("drops", ref => ref.orderBy("createdAt","desc") ).subscribe( (drops:Drop[])=> {
      this.items = [];
      console.log("list drops...")
      console.log(drops);
      for (let i = 0; i < drops.length; i++) {
        this.items.push({
          id: drops[i].id,
          //why oh why do I get two events in update, and one with uptatedAt == null?
          date: format(drops[i].createdAt ? drops[i].createdAt.toDate() : "",'DD/MM HH:mm'),
          note: drops[i].text,
          icon: drops[i].type == "NOTE" ? "document" : "document"
        });
      }
    });

  }

  formatDate(date) {
      console.log(date);
      return format(date,'DD/MM HH:mm');      
  }

  deleteDrop(id,event) {
    console.log("delete "+id);
    this.dropsService.delete("drops/"+id).then( 
        (value) => { console.log("deletes") },
        (error) => { console.log("error") }
    );
    event.preventDefault();
    event.stopPropagation();
  }

}
