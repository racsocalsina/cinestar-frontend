import { Pipe, PipeTransform } from '@angular/core';

@Pipe( { name: 'timeToDate' } )
export class TimeToDatePipe implements PipeTransform {
    transform( value: any ): string {
        try {
            const [_, time] = value.split( ' ' );
            const h = Number( time.split( ':' )[ 0 ] );
            const hh = h > 12 ? h - 12 : h;
            const m = time.split( ':' )[ 1 ];
            return `${[hh, m].join( ':' )} ${h > 11 ? 'pm' : 'am'}`;
        } catch ( e ) {
            return value.toString();
        }

    }
}
