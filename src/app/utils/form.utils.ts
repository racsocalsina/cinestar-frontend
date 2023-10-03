import { AbstractControl, Validators } from '@angular/forms';
import { Documents } from '@utils/enums';
import { DocumentType } from '@utils/types';

export class FormUtils {

    static validateDocumentType( type: DocumentType, control: AbstractControl ): void {
        const value = control.value;
        control.reset();
        if ( type === Documents.DNI ) {
            control.setValidators( [
                Validators.required,
                Validators.minLength( 8 ),
                Validators.maxLength( 8 ),
                Validators.pattern( /^[0-9]*$/ )
            ] );
        } else if ( type === Documents.RUC ) {
            control.setValidators( [
                Validators.required,
                Validators.minLength( 11 ),
                Validators.maxLength( 11 ),
                Validators.pattern( /^[0-9]*$/ )
            ] );
        } else if ( type === Documents.CE || type === Documents.PAS ) {
            control.setValidators( [
                Validators.required,
                Validators.minLength( 1 ),
                Validators.maxLength( 12 ),
                Validators.pattern( /^[a-zA-Z0-9]*$/ )
            ] );
        }

        control.setValue( value );

        if ( value ) {
            control.markAsTouched();
        }
    }
}
