import { Pipe, PipeTransform } from '@angular/core';
import { Utils } from '@utils/utils';

@Pipe( { name: 'minutes' } )
export class SecondsToMinutesPipe implements PipeTransform {
    transform( value: string | number ): string {
        try {
            return Utils.secondsToMinutes( value );
        } catch ( e ) {
            return value.toString();
        }

    }
}
