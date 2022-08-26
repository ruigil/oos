import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { DropTask } from './drop-task';

@Component({
  selector: 'oos-drop-task',
  templateUrl: './drop-task.component.html',
  styleUrls: ['./drop-task.component.scss']
})
export class DropTaskComponent implements OnInit {
  @Input() drop:DropTask = new DropTask();

  constructor(
    private oos: OceanOSService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  complete(event:MouseEvent) {
        this.drop.content.completed = !this.drop.content.completed;
        this.drop.content.date = Date.now();
        event.stopPropagation();
        this.oos.putDrop(this.drop);
  }

  edit() {
    this.router.navigate(['/drop/task/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
