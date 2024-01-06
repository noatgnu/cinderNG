import {Component, Input} from '@angular/core';
import { PlotlyViaCDNModule } from 'angular-plotly.js';
PlotlyViaCDNModule.setPlotlyVersion('latest');
PlotlyViaCDNModule.setPlotlyBundle('basic');
@Component({
  selector: 'app-sample-data-dialog',
  standalone: true,
  imports: [PlotlyViaCDNModule],
  templateUrl: './sample-data-dialog.component.html',
  styleUrl: './sample-data-dialog.component.scss'
})
export class SampleDataDialogComponent {
  @Input() data: any = {}

  @Input() annotations: any = {}

  @Input() comparison_matrix: any = {}

  constructor() {
  }

  drawBarChart() {

  }

}
