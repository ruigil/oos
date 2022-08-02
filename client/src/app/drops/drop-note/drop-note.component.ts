import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { DateTimeService } from 'src/app/services/date-time.service';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-drop-note',
  templateUrl: './drop-note.component.html',
  styleUrls: ['./drop-note.component.scss']
})
export class DropNoteComponent implements OnInit {
  @Input() drop:Drop = new Drop();

  constructor(
    private oos: OceanOSService, 
    private router: Router,
    private dts: DateTimeService) { 
  }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/note/edit', this.drop.id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
