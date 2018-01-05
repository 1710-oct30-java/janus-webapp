import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { VpHomeLineGraphService } from '../../services/graph/vp-home-line-graph.service';
import { VpHomeSelectorService } from '../../services/selector/vp-home-selector.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { environment } from '../../../../environments/environment';
import { EnvironmentService } from '../../services/environment.service';

@Component({
  selector: 'app-vp-line-graph',
  templateUrl: './vp-line-graph.component.html',
  styleUrls: ['../homeCSS/vpHomeCharts.css']
})
export class VpLineGraphComponent implements OnInit {
  public results: any;
  public addresses = [];
  public lineChartData: ChartDataEntity;
  public hasData = false;
  public selectedLineState = '';
  public selectedLineCity = '';
  public states: Set<string>;
  public cities: Set<string>;
  public selectedState = false;

  constructor(private http: HttpClient,
    private vpHomeLineGraphService: VpHomeLineGraphService,
    private vpHomeSelectorService: VpHomeSelectorService,

    private environmentService: EnvironmentService) { }

  ngOnInit() {
    this.lineChartData = this.vpHomeLineGraphService.getLineChartData();
    this.http.get(this.environmentService.buildUrl('all/reports/dashboard'), { withCredentials: true })
      .subscribe(
      (resp) => {
        this.results = resp;
        this.results.sort();
        this.lineChartData = this.vpHomeLineGraphService.fillChartData(this.results, this.lineChartData, '', '');
        this.addresses = this.vpHomeSelectorService.populateAddresses(this.results);
        this.states = this.vpHomeSelectorService.populateStates(this.addresses);
        this.hasData = true;
      });
  }

  /**
  * called when a state is selected to get cities for the cities drop down
  * as well as re-populate the chartData
  */

  findCities(state) {
    this.hasData = false;
    this.selectedLineCity = '';
    if (state === '') {
      this.selectedState = false;
    } else {
      this.selectedState = true;
      this.cities = this.vpHomeSelectorService.populateCities(this.selectedLineState, this.addresses);
    }
    this.lineChartData = this.vpHomeLineGraphService.fillChartData(this.results, this.lineChartData, this.selectedLineState, '');
    this.hasData = true;
  }

  /**
  *  after a city is selected, update the graph to reflect the selected city
  */

  hasCity(city) {
    if (this.cities.size > 1) {
      this.lineChartData = this.vpHomeLineGraphService
        .fillChartData(this.results, this.lineChartData, this.selectedLineState, this.selectedLineCity);
      this.hasData = true;
    }
  }
}
