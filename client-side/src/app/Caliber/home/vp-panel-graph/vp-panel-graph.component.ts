import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http/';
import { VpHomePanelGraphService } from '../../services/graph/vp-home-panel-graph.service';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { environment } from '../../../../environments/environment.prod';
import { EnvironmentService } from '../../services/environment.service';
import { AlertsService } from '../../services/alerts.service';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'app-vp-panel-graph',
  templateUrl: './vp-panel-graph.component.html',
  styleUrls: ['../homeCSS/vpHomeCharts.css']
})
export class VpPanelGraphComponent implements OnInit {
  public panelChartData: ChartDataEntity;
  public hasPanelGraphData = false;
  constructor(private http: HttpClient, private vpHomePanelGraphService: VpHomePanelGraphService,
    private environmentService: EnvironmentService, private alertService: AlertsService,
    private reportsService: ReportsService) { }

  ngOnInit() {
    this.panelChartData = this.vpHomePanelGraphService.getPanelChartData();
    this.reportsService.fetchReportsBiWeeklyPanel()
      .subscribe(
      (resp) => {
        this.panelChartData = this.vpHomePanelGraphService.fillPanelChartData(resp, this.panelChartData);
        this.hasPanelGraphData = true;
      }
    );  }

}
