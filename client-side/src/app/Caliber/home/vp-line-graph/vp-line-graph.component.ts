import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { WeeklyProgress } from '../../entities/weeklyProgress';
import { LineChartData } from '../../entities/lineChartData';
import { ChartData } from '../../entities/chartData';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { VpHomeLineGraphService } from '../../services/graph/vp-home-line-graph.service';
import { VpHomeSelectorService } from '../../services/selector/vp-home-selector.service';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ColorService } from '../../services/colors/color.service';

@Component({
  selector: 'app-vp-line-graph',
  templateUrl: './vp-line-graph.component.html',
  styleUrls: ['./vp-line-graph.component.css']
})
export class VpLineGraphComponent implements OnInit {
  public results: Array<WeeklyProgress>;
  public addresses = [];
  public lineChartData: LineChartData;
  public hasData = false;
  public selectedLineState = '';
  public selectedLineCity = '';
  public states: Set<string>;
  public cities: Set<string>;
  public selectedState = false;

  constructor(private http: Http,
    private vhlgs: VpHomeLineGraphService,
    private vhss: VpHomeSelectorService,
    private cs: ColorService) { }

  ngOnInit() {
    this.lineChartData = this.vhlgs.getLineChartData();
    console.log('grabbing batches');
    this.http.get('http://localhost:8080/all/reports/dashboard', { withCredentials: true })
      .subscribe(
      (resp) => {
        this.results = resp.json();
        console.log(this.results);
        this.results.sort();
        this.lineChartData = this.vhlgs.fillLineChartDate(this.results, this.lineChartData, '', '');
        this.addresses = this.vhss.populateAddresses(this.results);
        this.states = this.vhss.populateStates(this.addresses);
        this.hasData = true;
      });
  }
  // after a state is selected, find the cities that are part of that state
  findCities(state) {
    this.hasData = false;
    this.selectedLineCity = '';
    if (state === '') {
      this.selectedState = false;
      this.lineChartData = this.vhlgs.fillLineChartDate(this.results, this.lineChartData, '', '');
    } else {
      this.selectedState = true;
      this.cities = this.vhss.populateCities(this.selectedLineState, this.addresses);
    }
    this.lineChartData = this.vhlgs.fillLineChartDate(this.results, this.lineChartData, this.selectedLineState, '');
    this.hasData = true;
    console.log(this.lineChartData);
  }
  // after a city is selected, update the graph to reflect the selected city
  hasCity(city) {
    if (this.cities.size > 1) {
      this.lineChartData = this.vhlgs.fillLineChartDate(this.results, this.lineChartData, this.selectedLineState, this.selectedLineCity);
      this.hasData = true;
    }
  }
}
