import {Component, Input} from '@angular/core';
import {PlotlyService, PlotlyViaCDNModule} from 'angular-plotly.js';
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
  barWidth: number = 100
  revision: number = 0

  defaultColorList: string[] = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#bd7ebe",
    "#ffb55a",
    "#ffee65",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
  ]

  constructor(public plotlyService: PlotlyService) {

  }

  drawBarChart() {
    const graphs: any = {}
    for (const c of this.conditions) {
      graphs[c] = {
        x: [],
        y: [],
        type: 'bar',
        name: c,
        marker: {
          color: this.defaultColorList[this.conditions.indexOf(c) % this.defaultColorList.length]
        },
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

  async saveAsDataURI() {
    const plotlyDiv = this.plotlyService.getInstanceByDivId('sample-data-bar-chart')
    const plotly = await this.plotlyService.getPlotly()
    plotly.toImage(plotlyDiv, {format: 'png', width: this.graphLayout.width, height: this.graphLayout.height}).then((dataURI: string) => {
      console.log(dataURI)
    })
  }

}
