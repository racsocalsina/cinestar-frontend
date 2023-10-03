import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@utils/validators.utils';

@Component( {
    selector: 'app-form-update-password',
    templateUrl: './form-update-password.component.html',
    styleUrls: ['./form-update-password.component.scss']
} )
export class FormUpdatePasswordComponent implements OnInit {

    @Output() onBack = new EventEmitter();

    form!: FormGroup;
    isTextFieldType!: boolean;
    isTextFieldType2!: boolean;
    isTextFieldType3!: boolean;

    constructor( private fb: FormBuilder ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.form = this.fb.group( {
            password: [
                null, [
                    Validators.required
                ]
            ],
            new_password: [
                null, [
                    Validators.required,
                    Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]+)([a-zA-Z0-9]+)$/ ),
                    Validators.minLength( 6 )
                ]
            ],
            password_confirmation: [
                null, [
                    Validators.required,
                    Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]+)([a-zA-Z0-9]+)$/ ),
                    Validators.minLength( 6 )
                ]
            ],
        }, { validators: CustomValidators.equalValues( 'new_password', 'password_confirmation' ) } );
    }

}
