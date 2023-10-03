import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive( {
    selector: '[alphaNumeric]'
} )
export class AlphaNumericDirective {

    /**
     * an: alpha numeric
     * n: numeric
     * a: letters
     */
    @Input() alphaNumericType: 'an' | 'n' | 'a' = 'an';

    alphabet = /^[a-zA-ZáéíóúÁÉÍÓÚÑñ ]*$/;
    alphaNumeric = /^[a-zA-ZáéíóúÁÉÍÓÚÑñ0-9 ]*$/;
    numeric = /^[0-9]*$/;


    constructor( private el: ElementRef ) { }

    @HostListener( 'keypress', ['$event'] ) onKeyPress( event: { key: string; } ): boolean {
        switch ( this.alphaNumericType ) {
            case 'a':
                return new RegExp( this.alphabet ).test( event.key );
            case 'n':
                return new RegExp( this.numeric ).test( event.key );
            default:
                return new RegExp( this.alphaNumeric ).test( event.key );

        }
    }

    @HostListener( 'paste', ['$event'] ) blockPaste( event: KeyboardEvent ): void {
        setTimeout( () => {
            switch ( this.alphaNumericType ) {
                case 'a':
                    this.el.nativeElement.value = this.filter( this.el.nativeElement.value, this.alphabet );
                    break;
                case 'n':
                    this.el.nativeElement.value = this.filter( this.el.nativeElement.value, this.numeric );
                    break;
                default:
                    this.el.nativeElement.value = this.filter( this.el.nativeElement.value, this.alphaNumeric );
            }

        }, 1 );
    }

    filter( value: string, regEx: RegExp ): string {
        if ( value ) {
            const arr: string[] = [];
            value.split( '' ).forEach( n => {
                if ( regEx.test( n ) ) {
                    arr.push( n );
                }
            } );
            return arr.join( '' );
        } else {
            return value;
        }
    }

}
