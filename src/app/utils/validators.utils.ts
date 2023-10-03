import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

type FileType = 'pdf';

export class CustomValidators {

    static isValidEmail( control: AbstractControl ): { [ key: string ]: boolean } | null {
        const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( control.value && !emailPattern.test( control.value.toLowerCase() ) ) {
            return { email: true };
        }
        return null;
    }

    static equalValues( key1: string, key2: string ): {} {
        return ( group: FormGroup ): { [ key: string ]: boolean } | null => {
            const control1 = group.get( key1 );
            const control2 = group.get( key2 );

            if ( control1 && control1.value && control2 && control2.value ) {
                return control1.value === control2.value ? null : { notEquals: true };
            } else {
                return null;
            }
        };
    }
}
