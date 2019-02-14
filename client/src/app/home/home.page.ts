import { format, parse } from 'date-fns';
import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
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
  dropsObs: Observable<Drop[]>;

  constructor(private dropsService: FireService, private tagFilterService: TagFilterService) {


  }

    ngOnInit(): void {
        this.tagFilterService.tagFilter().subscribe( filters => {
            this.dropsObs = this.dropsService.getDropsWithFilters(filters);
        });
        this.dropsObs = this.dropsService.getDropsWithFilters([]);
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
