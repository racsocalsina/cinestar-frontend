import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '@services/auth.service';
import { CustomValidators } from '@utils/validators.utils';
import { ActivatedRoute } from '@angular/router';

@Component( {
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
} )
export class RecoverPasswordComponent implements OnInit {

    login = new EventEmitter();
    form!: FormGroup;
    isLoading!: boolean;
    isLoading2!: boolean;
    error!: string | null;
    message!: string | null;
    sent = false;

    constructor( private fb: FormBuilder,
                 public bsModalRef: BsModalRef,
                 private authService: AuthService ) {
        this.createForm();
    }

    ngOnInit(): void {
    }

    onClickLogin(): void {
        this.login.emit();
        this.bsModalRef.hide();
    }

    recoverPassword(): void {
        this.error = null;
        this.message = null;
        this.sent = false;
        this.form.markAllAsTouched();
        if ( this.form.valid ) {
            // if ( type ) { this.isLoading2 = true; } else { this.isLoading = true; }
            this.isLoading = true;
            this.authService.recoveryPasswordEmail( this.form.value )
            .then( res => {
                console.log( res );
                this.message = res.message;
                this.sent = true;
                setTimeout( () => {
                    this.message = null;
                }, 3000 );
                // this.bsModalRef.hide();
                // this.dataEvt.emit( true );
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
            email: [null, [Validators.required, CustomValidators.isValidEmail]],
            origin: ['web', Validators.required]
        } );
    }

}
