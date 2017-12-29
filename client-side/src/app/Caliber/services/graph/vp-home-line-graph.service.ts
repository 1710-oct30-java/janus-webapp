import { Injectable } from '@angular/core';
import { LineChartData } from '../../entities/lineChartData';
import { WeeklyProgress } from '../../entities/weeklyProgress';
import { ChartData } from '../../entities/chartData';
import { ColorService } from '../colors/color.service';

@Injectable()
export class VpHomeLineGraphService {
  public lineChartData = new LineChartData();
  constructor(private cs: ColorService) {
    this.cs.setVPHomeLineColors([this.lineChartData.mainColor, this.lineChartData.secondaryColor]);
  }

  public getLineChartData() {
    return new LineChartData();

  }

  public fillLineChartDate(results: Array<WeeklyProgress>, lcd: LineChartData, state: string, city: string) {
    let holder;
    lcd = this.clearLineChartData(lcd);
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
      const dataHolder = new ChartData();
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
      lcd.data.push(dataHolder);
    }
    for (let i = 1; i < highestWeek; i++) {
      lcd.labels.push('Week ' + i);
    }
    lcd.colors = this.cs.getLineColors(lcd.data.length);
    console.log(lcd);
    return lcd;
  }

  private clearLineChartData(lcd: LineChartData) {
    lcd.data.length = 0;
    lcd.labels.length = 0;
    lcd.colors.length = 0;
    return lcd;
  }
}
