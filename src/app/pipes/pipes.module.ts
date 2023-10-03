import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondsToMinutesPipe } from './seconds-to-minutes.pipe';
import { TimePipe } from '@pipes/time.pipe';
import { TimeToDatePipe } from '@pipes/time-to-date.pipe';


@NgModule( {
    declarations: [
        SecondsToMinutesPipe,
        TimePipe,
        TimeToDatePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        SecondsToMinutesPipe,
        TimePipe,
        TimeToDatePipe
    ]
} )
export class PipesModule {}
