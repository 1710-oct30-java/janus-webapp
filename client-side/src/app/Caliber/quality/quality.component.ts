import { Component, OnInit, OnDestroy } from '@angular/core';
import { Batch } from '../entities/Batch';
import { NoteService } from '../services/note.service';
import { BatchService } from '../services/batch.service';
import { Subscription } from 'rxjs/Subscription';

// pipes
import { DisplayBatchByYear } from '../pipes/display-batch-by-year.pipe';


@Component({
  selector: 'app-quality',
  templateUrl: './quality.component.html',
  styleUrls: ['./quality.component.css'],
  providers: [ DisplayBatchByYear ],
})
export class QualityComponent implements OnInit, OnDestroy {

  batches: Batch[];

  currentBatch: Batch = new Batch();
  currentYear: number;

  batchSubscription: Subscription;


  constructor(
    private batchService: BatchService,
    private batchesByYearPipe: DisplayBatchByYear
  ) {
    this.setCurrentYear( this.getCalendarYear() );
  }

  ngOnInit() {
    this.batchService.fetchAll();
    this.batchSubscription = this.batchService.getList()
      .subscribe( (batches) => this.setBatches(batches) );
   }

   ngOnDestroy() {
    this.batchSubscription.unsubscribe();
   }

   private setBatches(batches: Batch[]): void {
    this.batches = batches;
   }


   public onYearSelect(year: number) {
     const currentYearBatches: Batch[] = this.batchesByYearPipe.transform(this.batches, year);
     this.setCurrentYear(year);
     
     if ( currentYearBatches.length > 0 ) {
       this.currentBatch = currentYearBatches[0];
     } else {
       this.currentBatch = null;
     }

   }

   private getCalendarYear(): number {
     return new Date().getFullYear();
   }

   public setCurrentYear(currentYear: number): void {
     this.currentYear = currentYear;

     // console.log(currentYear);
   }

   getTrackedYears(): number[] {
     const thisYear: number = this.getCalendarYear();
     const trackedYears = [];

     for (let i = 0; i < 3; i++) {
       trackedYears.push(thisYear - i);
     }
     // console.log(trackedYears);
     return trackedYears;
   }

   onBatchSelect(batchId: number) {
    // console.log(batchId)f;
    const selectedBatches = this.batches.filter( (batch) => ( Number(batch.batchId) === Number(batchId) ) );

    if ( selectedBatches.length === 1 ) {
      this.currentBatch = selectedBatches[0];
    }

  }

}
