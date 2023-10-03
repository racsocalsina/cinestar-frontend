import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component( {
    selector: 'app-quantity-picker',
    templateUrl: './quantity-picker.component.html',
    styleUrls: ['./quantity-picker.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: QuantityPickerComponent,
            multi: true
        }
    ]
} )
export class QuantityPickerComponent implements ControlValueAccessor {

    @Input() totalQty = 0;
    @Input() maxValue = 0;
    @Input() sm = false;
    @Input() disabled = false;
    currentValue = 0;
    onChange = ( _: number | string ) => { };
    onTouch = () => { };

    constructor() { }

    add(): void {
        if ( !this.disabled && ( ( this.maxValue > 0 && this.currentValue < this.maxValue ) || this.maxValue === 0 ) ) {
            this.currentValue = this.currentValue + 1;
            this.onChange( this.currentValue );
            this.onTouch();
        }
    }

    sub(): void {
        this.currentValue = this.currentValue > 0 ? this.currentValue - 1 : 0;
        this.onChange( this.currentValue );
        this.onTouch();
    }

    registerOnChange( fn: ( _: number | string ) => void ): void {
        this.onChange = fn;
    }

    registerOnTouched( fn: () => void ): void {
        this.onTouch = fn;
    }

    writeValue( value: number | string ): void {
        if ( !isNaN( Number( value ) ) ) {
            this.currentValue = Number( value );
        }
    }

}
