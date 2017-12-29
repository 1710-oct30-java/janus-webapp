import { Component, OnInit, Input, OnChanges } from '@angular/core';

/**
 * To use this component insert this html element:
 *<app-graph  *ngIf="chartData" [data]="(chartData | graphData:dataSetLabels)" [legend]=true [type]="chartType"></app-graph>
 *
 *chartData is an array of datasets. [dataset 1,dataset 2 . . .]
 *each dataset is the raw return from the service
 *the pipe 'graphData' in the example takes the raw data from the service and formats it.
 *dataSetLabels is an array that is the label for each dataset
 *
 *chartType is the type of chart to display must string one of these strings {'line', 'radar', 'bar', 'doughnut'}
 *
 *Tables follow the same format.
 *
 *trainee-tech-skills is an example of both grpah and table in use.
 * @author John Hudson
*/

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html'
})
export class GraphComponent implements OnInit, OnChanges {
  // input variables from parent
  @Input() public data: any;
  @Input() public legend: boolean;
  @Input() public type: string;

  // class variables
  // raw data from input
  public chartMaps: any = null;
  // data sets to graph
  public chartData: any[] = null;
  // labels for graph
  public chartLabels: any[] = null;
  public chartLegend = false;
  public chartType: string = null;
  public chartOptions: any = null;

  public chartColors: Array<any> = [];

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
  public ngOnInit() {
    this.chartMaps = this.data;
    this.chartType = this.type;
    this.chartLegend = this.legend;
    if (this.data !== null) {
      // set up local array to be filled
      const _chartData: any[] = [];
      let _chartLabels: string[] = [];
      // Only need labels once so am using a flag
      let label = true;
      // gets data from input
      for (const chartMap of this.chartMaps) {
        const _chartDataRow: number[] = [];
        // breaks data and labels out from key/value pairs
        chartMap.data.forEach((value: number, key: string) => {
          _chartDataRow.push(value);
          if (label) {
            _chartLabels.push(key);
          }
        });
        label = false;
        _chartData.push({ data: _chartDataRow, label: chartMap.label });
      }

      // control look of chart based on type
      switch (this.chartType) {
        case 'radar':
          this.chartColors = [
            this.color('114, 164, 194'),
            this.color('242, 105, 37'),
            this.color('71, 76, 85'),
            this.color('252, 180, 20'),
            this.color('0, 160, 0')];
          this.chartOptions = this.chartOption(this.chartType);
          break;
        case 'bar':
          if (_chartData[0].data.length !== 1) {
            this.chartColors = [
              this.color('114, 164, 194'),
              this.color('252, 180, 20')
            ];
            this.chartOptions = this.chartOption(this.chartType);
          } else {
            // make benchmark date array length match other data array
            const benchmarkData: number[] = [];
            const benchmark = _chartData[0].data[0];
            _chartData[1].data.forEach(function () {
              benchmarkData.push(benchmark);
            });
            _chartData[0].data = benchmarkData;

            // color the bars
            this.chartColors = [
              this.benchMarkColor()
              , this.color('114, 164, 194')
            ];
            _chartLabels = [];
            this.chartMaps[1].data.forEach((value: number, key: string) => {
              _chartLabels.push(key);
            });
            _chartData[1].label = 'Batch Scores';
            _chartData[0].type = 'line';


            this.chartOptions = this.chartOption('barAverageCompare');
          }
          break;
        case 'line':
          this.chartColors = [
            this.color('114, 164, 194'),
            this.color('252, 180, 20')
          ];
          this.chartOptions = this.chartOption(this.chartType);
          break;
        case 'doughnut':
          // doughnut colors are weird for some reason
          const _chartColors: any[] = [{ backgroundColor: [] }];
          let doughnutColor = '114, 164, 194';
          _chartLabels.forEach(function (doughnutLabel) {
            if (doughnutLabel === 'Superstar') {
              doughnutColor = '57, 63, 239';
            } else if (doughnutLabel === 'Good') {
              doughnutColor = '24, 173, 24';
            } else if (doughnutLabel === 'Average') {
              doughnutColor = '249, 233, 0';
            } else if (doughnutLabel === 'Poor') {
              doughnutColor = '234, 40, 37';
            }
            _chartColors[0].backgroundColor.push('rgba(' + doughnutColor + ', .7)');
          });
          this.chartColors = _chartColors;
          break;
      }
      this.chartData = _chartData;
      this.chartLabels = _chartLabels;
    }
  }
  public ngOnChanges(changes) {
    if (changes['data']) {
      this.ngOnInit();
    }
  }

  // returns an object for chart color info
  color(input: string) {
    return {
      backgroundColor: 'rgba(' + input + ', .5)',
      pointBackgroundColor: 'rgba(' + input + ', .5)',
      borderColor: 'rgba(' + input + ', 1)',
      borderWidth: 2,
      pointHoverBackgroundColor: 'rgba(' + input + ', .3)',
      pointHoverBorderColor: 'rgba(' + input + ', .3)',
      pointBorderColor: '#fff'
    };
  }
  benchMarkColor() {
    return {
      pointRadius: 0,
      pointHoverRadius: 0,
      borderWidth: 3,
      borderColor: 'rgba(252,180,20,1)',
      backgroundColor: 'rgba(252,180,20, .5) ',
      pointBackgroundColor: 'rgba(252,180,20,1)',
      pointHoverBackgroundColor: 'rgba(252,180,20,1)',
      pointHoverBorderColor: 'rgba(252,180,200, 0.5)',
      fill: false,
      label: 'Benchmark',
      pointBorderColor: '#fff'
    };
  }
  // returns an object for chart options
  chartOption(_chartType: string) {
    // default is radar options
    const _chartOptions: any = {
      responsive: true,
      tooltips: {
        mode: 'label'
      },
      scale: {
        ticks: {
          beginAtZero: false,
          fixedStepSize: 10,
          max: 100,
          suggestedMin: 40
        }
      }
    };
    if (_chartType === 'radar') {
      return _chartOptions;
    }
    // remove scale field replace it with scales
    delete _chartOptions.scale;
    _chartOptions.scales = {
      yAxes: [{
        ticks: {
          beginAtZero: false,
          fixedStepSize: 10,
          max: 100,
          suggestedMin: 40
        },
        scaleLabel: {
          display: true,
          labelString: 'Average'
        }
      }]
    };
    // is now normal bar chart options
    if (_chartType === 'bar') {
      return _chartOptions;
    } else if (_chartType === 'line') {
      // line charts need a label
      _chartOptions.scales.xAxes = [{
        scaleLabel: {
          display: true,
          labelString: 'Week'
        }
      }];
      return _chartOptions;
    } else if (_chartType === 'barAverageCompare') {
      // this one needs to change how the tooltip displays
      _chartOptions.tooltips = {
        mode: 'label'
      };
      return _chartOptions;
    }
  }
}

