import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-drop-photo',
  templateUrl: './drop-photo.component.html',
  styleUrls: ['./drop-photo.component.scss']
})
export class DropPhotoComponent implements OnInit {

  @Input() drop:Drop = new Drop();

  constructor(
    private oos: OceanOSService, 
    private router: Router) { 
  }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/photo/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
