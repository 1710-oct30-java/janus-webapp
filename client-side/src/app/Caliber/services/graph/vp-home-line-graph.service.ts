import { Injectable } from '@angular/core';
import { ChartDataEntity } from '../../entities/ChartDataEntity';
import { DataSet } from '../../entities/DataSet';
import { ColorService } from '../colors/color.service';

@Injectable()
export class VpHomeLineGraphService {
  public lineChartData = new ChartDataEntity();
  constructor(private cs: ColorService) {
    this.cs.setVPHomeLineColors([this.lineChartData.mainColor, this.lineChartData.secondaryColor]);
  }

  /**
   * Factory for creating ChartDataEntity
   * used for the line chart on Vp Home
   * @returns {ChartDataEntity}
   * @memberof VpHomeLineGraphService
   */
  public getLineChartData(): ChartDataEntity {
    const lineChartData = new ChartDataEntity();
    lineChartData.colors = [lineChartData.mainColor, lineChartData.secondaryColor];
    lineChartData.options = {
      legend: {
        display: true,
        labels: {
          boxWidth: 10
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Week'
          },
          ticks: {
            autoSkip: false,
          }

        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: 'Score'
          },

          ticks: {
            suggestedMin: 40,
            suggestedMax: 100,
            stepSize: 20,
          }
        }]
      },
      datasetFill: false,
      tooltips: {
        mode: 'x',
      },
      responsive: true,
      maintainAspectRatio: false,
    };
    lineChartData.data = [];
    lineChartData.type = 'line';
    return lineChartData;

  }

  /**
   * Populates and returns a ChartDataEntity.
   * @param {*} results
   * @param {ChartDataEntity} lineChartData
   * @param {string} state
   * @param {string} city
   * @returns {ChartDataEntity}
   * @memberof VpHomeLineGraphService
   */
  public fillChartData(results: any, lineChartData: ChartDataEntity, state: string, city: string): ChartDataEntity {
    let holder;
    lineChartData = this.clearLineChartData(lineChartData);
    if (state !== '') {
      holder = results.filter(i => i.address.state === state);
      if (city !== '') {
        holder = holder.filter(i => i.address.city === city);
      }
    } else {
      holder = results;
    }
    let highestWeek = 0;
    for (const item of holder) {
      let currentWeek = 1;
      const dataHolder = new DataSet();
      dataHolder.fill = false;
      dataHolder.label = item.label;
      let iterator = 0;
      const keys = Object.keys(item.grades);
      for (const key of keys) {
        while (currentWeek < Number(keys[iterator])) {
          dataHolder.data.push(0);
          currentWeek++;
        }
        dataHolder.data.push(item.grades[key].toFixed(2));
        currentWeek++;
        if (currentWeek > highestWeek) {
          highestWeek = currentWeek;
        }
        iterator++;
      }
      lineChartData.data.push(dataHolder);
    }
    for (let i = 1; i < highestWeek; i++) {
      lineChartData.labels.push('Week ' + i);
    }
    lineChartData.colors = this.cs.getLineColors(lineChartData.data.length);
    return lineChartData;
  }

  /**
   * Clears the arrays of a ChartDataEntity
   * @private
   * @param {ChartDataEntity} lineChartData
   * @returns {ChartDataEntity}
   * @memberof VpHomeLineGraphService
   */
  private clearLineChartData(lineChartData: ChartDataEntity): ChartDataEntity {
    lineChartData.data.length = 0;
    lineChartData.labels.length = 0;
    lineChartData.colors = [];
    return lineChartData;
  }
}
