import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DropText } from './drop-text';
import { OceanOSService } from '../../services/ocean-os.service';
import { IDrop } from 'src/app/model/oos-types';

@Component({
  selector: 'oos-drop-text',
  templateUrl: './drop-text.component.html',
  styleUrls: ['./drop-text.component.scss']
})
export class DropTextComponent implements OnInit {
  @Input() drop:DropText = new DropText();

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
