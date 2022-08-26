import { Component, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from 'src/app/model/drop';
import { Stream } from 'src/app/model/stream';
import { compileDeclareInjectorFromMetadata } from '@angular/compiler';

@Component({
  selector: 'oos-drop-goal',
  templateUrl: './drop-goal.component.html',
  styleUrls: ['./drop-goal.component.scss']
})
export class DropGoalComponent implements AfterViewInit {
  @Input() drop:Drop = new Drop();
  totals: Array<number> = [0,0,0,0,0,0,0];
  streamTotals: Map<string,number[]> = new Map();

  constructor(private oos:OceanOSService, private router:Router) { }
        /*
         0 -> totals tasks,
         1 -> total task completed
         2 -> total expenses
         3 -> total incomes
         4 -> total rates
         5 -> total rate values
         6 -> total texts
         7 -> total images
        */

  ngAfterViewInit(): void {
    // construct a map with the totals for each tag
    this.streamTotals = new Map(this.drop.content!.streams.map((t:any) => [t.id,t.totals]))
    // construct an entry for totals, there is double count if a drop belongs to more than one tag
    this.streamTotals.set('all', [...this.streamTotals.values()].reduce( (acc,v) => acc.map( (t,i) =>  t + v[i]), [0,0,0,0,0,0,0,0] ) )
}

  edit() {
    this.router.navigate(['/goal/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

  streams():Stream[] {
    return this.drop.streams.filter( t => t.type.endsWith('_TYPE'));
  }

  summary(type:string, stream:Stream | null) {
    
    const task = (total:number,completed:number):string => `${total} of ${completed} (${((completed/total)*100 ).toFixed(2)} %)` 

    const income = (total:number) => `${total} CHF`

    const expense = (total:number) => `- ${total} CHF`

    const rate = (total:number, values: number) => `${total} (${ (values/total).toFixed(2) } avg)`

    const text = (total:number) => `${total}`

    const image = (total:number) => `${total}`

    const totals = (stream ? this.streamTotals.get(stream._id) : this.streamTotals.get('all')) || [0,0,0,0,0,0,0,0]; 

    return  type === 'task' && totals[0] != 0 ?  task(totals[0],totals[1]) :
            type === 'expense' && totals[2] != 0 ? expense(totals[2]) :
            type === 'income' && totals[3] != 0 ? income(totals[3]) :
            type === 'rate' && totals[4] != 0 ? rate(totals[4],totals[5]) :
            type === 'text' && totals[6] != 0 ? text (totals[6]) :
            type === 'image' && totals[7] != 0 ? image (totals[7]) :
            "";
  }

}
