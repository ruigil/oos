import { format, parse } from 'date-fns';
import { Component } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';

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
  public items: Array<{ id: string, date: string, title: string; note: string; icon: string }> = [];

  constructor(private dropsService: FireService) {
    this.dropsService.colWithIds$("drops").subscribe( (drops:Drop[])=> {
      this.items = [];
      console.log("list drops...")
      console.log(drops);
      for (let i = 0; i < drops.length; i++) {
        this.items.push({
          id: drops[i].id,
          //why oh why do I get two events, and one with uptated == null?
          //date: format(new Date(),'DD/MM HH:mm'),
          date: format(drops[i].updatedAt,'DD/MM HH:mm'),
          title: 'Item ' + i,
          note: drops[i].text,
          icon: this.icons[Math.floor(Math.random() * this.icons.length)]
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
