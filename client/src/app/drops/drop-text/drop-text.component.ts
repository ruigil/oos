import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-drop-text',
  templateUrl: './drop-text.component.html',
  styleUrls: ['./drop-text.component.scss']
})
export class DropTextComponent implements OnInit {
  @Input() drop:Drop = new Drop();

  constructor(
    private oos: OceanOSService, 
    private router: Router) { 
  }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/drop/text/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
