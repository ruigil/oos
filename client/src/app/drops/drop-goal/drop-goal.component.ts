import { Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from 'src/app/model/drop';
import { Tag } from 'src/app/model/tag';
import { compileDeclareInjectorFromMetadata } from '@angular/compiler';

@Component({
  selector: 'oos-drop-goal',
  templateUrl: './drop-goal.component.html',
  styleUrls: ['./drop-goal.component.scss']
})
export class DropGoalComponent implements AfterViewInit {
  @Input() drop:Drop = new Drop();
  totals: Array<number> = [0,0,0,0,0,0,0];
  tagTotals: Map<string,number[]> = new Map();

  constructor(
    private oos:OceanOSService, 
    private router:Router) { 

    }

  ngAfterViewInit(): void {
    // construct a map with the totals for each tag
    this.tagTotals = new Map(this.drop.goal!.tags.map(t => [t.id,t.totals]) )
    // add an entry for the total of totals
    this.tagTotals.set('all', [...this.tagTotals.values()].reduce( (acc,v) => acc.map( (t,i) => t + v[i] ), [0,0,0,0,0,0,0] ) )
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

  summary(type:string, tag:Tag | null) {
    
    const task = (total:number,completed:number):string => `${total} of ${completed} (${((completed/total)*100 ).toFixed(2)} %)` 

    const income = (total:number) => `${total} CHF`

    const expense = (total:number) => `- ${total} CHF`

    const rate = (total:number, values: number) => `${total} (${ (values/total).toFixed(2) } avg)`

    const note = (total:number) => `${total}`

    const totals = (tag ? this.tagTotals.get(tag.id) : this.tagTotals.get('all')) || [0,0,0,0,0,0,0]; 

    return  type === 'task' && totals[0] != 0 ?  task(totals[0],totals[1]) :
            type === 'expense' && totals[2] != 0 ? expense(totals[2]) :
            type === 'income' && totals[3] != 0 ? income(totals[3]) :
            type === 'rate' && totals[4] != 0 ? rate(totals[4],totals[5]) :
            type === 'note' && totals[6] != 0 ? note (totals[6]) :
            null;
  }

}
