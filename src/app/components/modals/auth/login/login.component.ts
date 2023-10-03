import { Component, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '@services/auth.service';
import { StorageUtils } from '@utils/storage.utils';
import { UserService } from '@services/user.service';
import {Router} from "@angular/router";

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
} )
export class LoginComponent extends StorageUtils implements OnInit {

    onLogin = new EventEmitter();
    forgotPassword = new EventEmitter();
    register = new EventEmitter();
    form!: FormGroup;
    isTextFieldType!: boolean;
    isLoading?: boolean;
    error?: string;
    message?: boolean;

    constructor( private fb: FormBuilder,
                 public bsModalRef: BsModalRef,
                 private userService: UserService,
                 private authService: AuthService,
                 private router: Router) {
        super();
    }

    ngOnInit(): void {
        if ( this.message ) {
            setTimeout( () => {
                this.message = false;
            }, 4000 );
        }
        this.createForm();
    }

    onClickRegister(): void {
        this.bsModalRef.hide();
        this.register.emit();
    }

    onClickRecoverPassword(): void {
        this.bsModalRef.hide();

        this.forgotPassword.emit();
    }

    private createForm(): void {
        this.form = this.fb.group( {
            username: [null, [Validators.required, Validators.minLength( 1 )]],
            password: [null, [Validators.required, Validators.minLength( 6 )]],
        } );
    }

    async login() {
        this.form.markAllAsTouched();
        this.error = undefined;

        if ( this.form.valid ) {
            this.isLoading = true;
            const params = this.form.value;

            try {
                const login = await this.authService.login( params );
                console.log( login );
                this.setLocalStorage( 'token', login.data.access_token );
                delete login.data.access_token;

                this.userService.getProfile().finally();
                // console.log( user );
                this.setLocalStorage( 'user', JSON.stringify( login.data ) );
                this.userService.setUser( login.data );
                this.isLoading = false;
                this.onLogin.emit();
                this.bsModalRef.hide();
                this.router.navigateByUrl( '/' );
            } catch ( e ) {
                this.error = e;
                this.isLoading = false;
            }
        }
    }


}
