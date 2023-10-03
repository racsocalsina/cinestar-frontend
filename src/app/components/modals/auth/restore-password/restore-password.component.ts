import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ActivatedRoute } from '@angular/router';
import { CustomValidators } from '@utils/validators.utils';
import { AuthService } from '@services/auth.service';

@Component( {
    selector: 'app-restore-password',
    templateUrl: './restore-password.component.html',
    styleUrls: ['./restore-password.component.scss']
} )
export class RestorePasswordComponent implements OnInit {
    login = new EventEmitter();
    dataEvt = new EventEmitter();
    token!: string;
    email!: string;
    form!: FormGroup;
    isTextFieldType!: boolean;
    isTextFieldType2!: boolean;

    isLoading!: boolean;
    error!: string | null;

    constructor( private fb: FormBuilder, public bsModalRef: BsModalRef,
                 private modalService: BsModalService,
                 private route: ActivatedRoute,
                 private authService: AuthService ) {
        this.createForm();
    }

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get( 'token' );
        const email = this.route.snapshot.queryParamMap.get( 'email' );

        if ( token && email ) {
            this.form.reset( {
                token,
                email,
                origin: 'web'
            } );
            console.log( this.form.value );
        }
    }

    changePassword() {
        this.error = null;
        this.form.markAllAsTouched();
        if ( this.form.valid ) {
            this.isLoading = true;
            this.authService.recoveryPassword( this.form.value )
            .then( res => {
                console.log( res );
                this.login.emit();
                this.dataEvt.emit( true );
                this.bsModalRef.hide();
            } ).catch( error => {
                console.log( error );
                this.error = error;
                setTimeout( () => {
                    this.error = null;
                }, 3000 );
            } ).finally( () => this.isLoading = false );
        }
    }

    private createForm(): void {
        this.form = this.fb.group( {
            origin: ['web', Validators.required],
            token: [null, Validators.required],
            email: [null, Validators.required],
            password: [
                null, [
                    Validators.required, Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]+)([a-zA-Z0-9]+)$/ ),
                    Validators.minLength( 6 )
                ]
            ],
            password_confirmation: [
                null, [
                    Validators.required, Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]+)([a-zA-Z0-9]+)$/ ),
                    Validators.minLength( 6 )
                ]
            ],
        }, { validators: CustomValidators.equalValues( 'password', 'password_confirmation' ) } );
    }

}
