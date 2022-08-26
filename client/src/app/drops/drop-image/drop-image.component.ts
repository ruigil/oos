import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-drop-image',
  templateUrl: './drop-image.component.html',
  styleUrls: ['./drop-image.component.scss']
})
export class DropImageComponent implements OnInit {

  @Input() drop:Drop = new Drop();

  constructor(
    private oos: OceanOSService, 
    private router: Router) { 
  }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/drop/photo/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
