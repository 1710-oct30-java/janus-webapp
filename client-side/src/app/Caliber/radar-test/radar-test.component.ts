// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { ReportingService } from '../../services/reporting.service';
// import { Subscription } from 'rxjs/Subscription';

// @Component({
//   selector: 'app-radar-test',
//   templateUrl: './radar-test.component.html',
//   styleUrls: ['./radar-test.component.css']
// })
// export class RadarComponent implements OnInit, OnDestroy {

//   // Chart labels
//   public radarChartLabels: string[] = ['AWS', 'Hibernate', 'JSP', 'Java', 'JavaScript', 'REST', 'SOAP', 'SQL', 'Spring'];

//   public radarOptions = {
//     legend : {
//       display : true
//     },
//     scale: {
//       ticks: {
//         beginAtZero : false,
//         fixedStepSize : 10,
//         max : 100,
//         suggestedMin : 40
//       }
//     }
//   };

//   // Chart type assignment
//   public radarChartType = 'radar';

//   // Dataset for chart
//   // In practice this data should come from an API call
//   public radarChartData: any = null;

//   private reportSubscription: Subscription;

//   constructor(private reports: ReportingService) { }

//   ngOnInit() {
//     // // this.reportSubscription = this.reports.batchOverallRadarChart.subscribe( (result) => {

//     //   if (!result) {
//     //     this.reports.fetchBatchOverallRadarChart(2201);
//     //   } else {
//     //     this.radarChartData = { data: result.data, label: 'label' };
//     //   }
//     // });
//   }

//   ngOnDestroy() {
//     this.reportSubscription.unsubscribe();
//   }



// }
