import { Injectable } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { ColorService } from '../colors/color.service';
import { DataSet } from '../../entities/DataSet';

@Injectable()
export class VpHomePanelGraphService {

  constructor(private cs: ColorService) { }

  /**
   * Factory for creating ChartDataEntity
   * used for the panel linechart on Vp Home
   * @returns {ChartDataEntity}
   * @memberof VpHomePanelGraphService
   */
  public getPanelChartData(): ChartDataEntity {
    const panelChartData = new ChartDataEntity();
    panelChartData.options = {
      legend : {
        display : true,
        labels : {
          boxWidth : 10
        }
      },
      scales : {
        xAxes : [ {
          scaleLabel : {
            display : true,
            labelString : 'Day'
          }

        } ],
        yAxes : [ {
          scaleLabel : {
            display : true,
            labelString : '# of Panels'
          },

          ticks : {
            suggestedMin : 0,
            // suggestedMax : max + 1,
            stepSize : 1
          }
        } ],

      },
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        mode: 'x',
    },
    };
    panelChartData.data = [];
    panelChartData.type = 'line';
    return panelChartData;
  }


  /**
   * Populates and returns a ChartDataEntity.
   * @param {*} results
   * @param {ChartDataEntity} panelChartData
   * @returns {ChartDataEntity}
   * @memberof VpHomePanelGraphService
   */
  public fillPanelChartData(results: any, panelChartData: ChartDataEntity): ChartDataEntity {
    const today = new Date();
    for ( const result of results) {
      for (const key of Object.keys(result)) {
        const lineResult = new DataSet();
        for (const subkey of Object.keys(result[key])) {
          lineResult.data.push(result[key][subkey]);
        }
        lineResult.label = key;
        lineResult.fill = false;
        panelChartData.data.push(lineResult);
        if (key === 'Pass') {
          panelChartData.colors.push(this.cs.generateLineColor('rgba(24, 173, 24,'));
        } else {
          panelChartData.colors.push(this.cs.generateLineColor('rgba(234, 40, 37,'));
        }
      }
    }
    for (const day of Object.keys(results[0]['Pass'])) {
      const d = this.dateFromDay(today.getFullYear(), day);
      panelChartData.labels.push(d.getMonth() + 1 + '/' + d.getDate());
    }
    return panelChartData;
  }

  /**
   * converts string to date
   * @private
   * @param {number} year
   * @param {*} day
   * @returns {Date}
   * @memberof VpHomePanelGraphService
   */
  private dateFromDay(year: number, day: any): Date {
    const date = new Date(year, 0);
    return new Date(date.setDate(day));
  }
}
