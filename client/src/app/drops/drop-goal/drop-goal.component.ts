import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { Settings } from 'src/app/model/settings';
import { Tag } from 'src/app/model/tag';
import { DateTimeService } from 'src/app/services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-drop-goal',
  templateUrl: './drop-goal.component.html',
  styleUrls: ['./drop-goal.component.scss']
})
export class DropGoalComponent implements OnInit {
  @Input() drop:Drop = new Drop();

  constructor(
    private oos:OceanOSService, 
    private router:Router, 
    private dts:DateTimeService) { 

    }

  ngOnInit(): void {
    this.oos.getSettings();
  }

  edit() {
    this.router.navigate(['/goal/edit', this.drop.id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

  tags():Tag[] {
    return this.drop.tags.filter( t => !t.id.endsWith('_TYPE'));
  }

}
