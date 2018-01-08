import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts/ng2-charts';
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

  @ViewChild('baseChart') chart: BaseChartDirective;

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


  private golden_ratio_conjugate = 0.618033988749895;
  private h: number;


  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
  public ngOnInit() {
    this.chartMaps = this.data;
    this.chartType = this.type;
    this.chartLegend = this.legend;
    this.h = Math.random();
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
          this.chartColors = [this.fillColor('114, 164, 194')];
          for (let i = 1; i < _chartData.length; i++) {
            this.chartColors.push(this.emptyColor(this.randColString()));
          }
          this.chartOptions = this.chartOption(this.chartType);
          break;
        case 'bar':
          if (_chartData[0].data.length !== 1) {
            this.chartColors = [
              this.fillColor('114, 164, 194'),
              this.fillColor('252, 180, 20')
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
              , this.fillColor('114, 164, 194')
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
            this.emptyColor('114, 164, 194'),
            this.emptyColor('252, 180, 20')
          ];
          this.chartOptions = this.chartOption(this.chartType);
          break;
        case 'doughnut':
          // doughnut colors are set weirdly compared to the other charts
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
      // ngOnInit has a lot pretty much all that is needed to redraw the chart
      this.ngOnInit();

      // just have to add the actual stuff to the chart
      if (this.chart !== undefined && this.chart.chart !== undefined) {
        // give the chart labels
        this.chart.chart.config.data.labels = this.chartLabels;
        // add the datasets to the chart
        this.chart.chart.config.data.datasets = this.chartData;
        // now those datasets need colors
        for (let i = 0; i < this.chart.chart.config.data.datasets.length; i++) {
          this.chart.chart.config.data.datasets[i] = Object.assign(this.chart.chart.config.data.datasets[i], this.chartColors[i]);
        }
      }
    }
  }


  /** returns an object for chart color info
    * @param input is a string either 'r,g,b' where r , g, and b are rgb values or a hex value (#ffffff).
  */
  fillColor(input: string) {
    if (input.charAt(0) === '#') {
      input = this.convertHex(input);
    }
    return {
      backgroundColor: 'rgba(' + input + ', .5)',
      pointBackgroundColor: 'rgba(' + input + ', .5)',
      borderColor: 'rgba(' + input + ', 1)',
      borderWidth: 2,
      pointHoverBackgroundColor: 'rgba(' + input + ', .3)',
      pointHoverBorderColor: 'rgba(' + input + ', .3)',
      pointBorderColor: '#fff',
      fill: true
    };
  }
  emptyColor(input: string) {
    const output = this.fillColor(input);
    output.fill = false;
    return output;
  }
  /**
   * generates nice looking pseudo-random colors.
  */
  randColString(): string {
    this.h += this.golden_ratio_conjugate;
    this.h %= 1;
    const rgb = this.hsvToRgb(this.h * 360, 100, 100);
    return (rgb[0] + ',' + rgb[1] + ',' + rgb[2]);
  }

  /**
  * HSV to RGB color conversion
  *
  * @param H runs from 0 to 360 degrees
  * @param S and @param V run from 0 to 100
  *
  * Function from
  * https://gist.github.com/eyecatchup/9536706/#file-hsvtorgb-js
  */
  hsvToRgb(h, s, v) {
    let r, g, b;
    let i;
    let f, p, q, t;

    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));

    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;

    if (s === 0) {
      // Achromatic (grey)
      r = g = b = v;
      return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
      ];
    }

    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));

    switch (i) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;

      case 1:
        r = q;
        g = v;
        b = p;
        break;

      case 2:
        r = p;
        g = v;
        b = t;
        break;

      case 3:
        r = p;
        g = q;
        b = v;
        break;

      case 4:
        r = t;
        g = p;
        b = v;
        break;

      default: // case 5:
        r = v;
        g = p;
        b = q;
    }

    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }
  /**
   * converts hex values to rgb values
   * @param hex the hex to convert to rgb
  */
  convertHex(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const result = r + ',' + g + ',' + b;
    return result;
  }
  /**
   * this returns the color for the benchmark line.
  */
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
  /**
   * returns an object for chart options
   * @param _chartType the type of chart to determine the options to return
   */
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
          fixedStepSize: 20,
          max: 100,
          suggestedMin: 40
        },
        scaleLabel: {
          display: true,
          labelString: 'Average'
        }
      }],
      xAxes: [{
        ticks: {
          autoSkip: false
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

