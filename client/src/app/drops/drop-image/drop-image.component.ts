import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OceanOSService } from '../../services/ocean-os.service';
import { DropImage } from './drop-image';

@Component({
  selector: 'oos-drop-image',
  templateUrl: './drop-image.component.html',
  styleUrls: ['./drop-image.component.scss']
})
export class DropImageComponent implements OnInit {

  @Input() drop:DropImage = new DropImage();
  @Input() public: boolean = false;
  @Input() colors: {[key: string]: string} = { 'background-color': "", 'color': "" };


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
