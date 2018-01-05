import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doughnut',
  templateUrl: './doughnut.component.html',
  styleUrls: ['./doughnut.component.css']
})
export class DoughnutComponent implements OnInit {

  constructor() { }

  public doughnutChartLabels: string[] = ['Superstar', 'Good', 'Average', 'Poor'];
  public doughnutChartData: number[] = [1, 11, 6, 2];
  public doughnutChartType = 'doughnut';

  ngOnInit() {
  }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}
