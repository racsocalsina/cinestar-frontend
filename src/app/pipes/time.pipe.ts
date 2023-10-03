import { Pipe, PipeTransform } from '@angular/core';

@Pipe( { name: 'time' } )
export class TimePipe implements PipeTransform {
    transform( value: string ): string {
        try {
            const h = Number( value.split( ':' )[ 0 ] );
            const hh = h > 12 ? h - 12 : h;
            const m = value.split( ':' )[ 1 ];
            return `${[hh, m].join( ':' )} ${h > 11 ? 'pm' : 'am'}`;
        } catch ( e ) {
            return value.toString();
        }

    }
}
