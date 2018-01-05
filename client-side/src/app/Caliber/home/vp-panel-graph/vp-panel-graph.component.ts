import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { VpHomePanelGraphService } from '../../services/graph/vp-home-panel-graph.service';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { environment } from '../../../../environments/environment.prod';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-vp-panel-graph',
  templateUrl: './vp-panel-graph.component.html',
  styleUrls: ['../homeCSS/vpHomeCharts.css']
})
export class VpPanelGraphComponent implements OnInit {
  public panelChartData: ChartDataEntity;
  public hasPanelGraphData = false;
  constructor(private http: HttpClient, private vpHomePanelGraphService: VpHomePanelGraphService,
    private environmentService: EnvironmentService) { }

  ngOnInit() {
    this.panelChartData = this.vpHomePanelGraphService.getPanelChartData();
    this.http.get(this.environmentService.buildUrl('all/reports/biweeklyPanelResults'), { withCredentials: true })
      .subscribe(
      (resp) => {
        this.panelChartData = this.vpHomePanelGraphService.fillPanelChartData(resp, this.panelChartData);
        console.log(this.panelChartData);
        this.hasPanelGraphData = true;
      }

      );
  }

}
