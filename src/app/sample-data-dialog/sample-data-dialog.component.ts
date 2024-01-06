import {Component, Input} from '@angular/core';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
PlotlyViaCDNModule.setPlotlyVersion('latest');
PlotlyViaCDNModule.setPlotlyBundle('basic');
@Component({
  selector: 'app-sample-data-dialog',
  standalone: true,
  imports: [PlotlyViaCDNModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
  templateUrl: './sample-data-dialog.component.html',
  styleUrl: './sample-data-dialog.component.scss'
})
export class SampleDataDialogComponent {
  @Input() data: any = {}

  @Input() annotations: any = {}

  @Input() conditions: string[] = []
  graphData: any[] = []
  graphLayout: any = {
    width: 1000,
    height: 600,
    margin: {
      l: 40,
      r: 40,
      b: 40,
      t: 40,
    }
  }
  barWidth: number = 20
  revision: number = 0
  constructor() {
  }

  drawBarChart() {
    const graphs: any = {}
    for (const c of this.conditions) {
      graphs[c] = {
        x: [],
        y: [],
        type: 'bar',
        name: c,
      }
    }
    let columns = 0
    for (const d in this.data) {
      if (this.annotations[d]) {
        graphs[this.annotations[d]].x.push(d)
        graphs[this.annotations[d]].y.push(this.data[d])
        columns += 1
      }
    }
    this.graphData = []
    for (const c of this.conditions) {
      this.graphData.push(graphs[c])
    }
    console.log(this.graphData)
    this.graphLayout.width = this.graphLayout.margin.l + this.graphLayout.margin.r + columns * this.barWidth
    console.log(this.graphLayout)
    this.revision += 1
  }

}
