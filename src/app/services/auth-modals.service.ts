import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LoginComponent } from '@modals/auth/login/login.component';
import { take } from 'rxjs/operators';
import { RecoverPasswordComponent } from '@modals/auth/recover-password/recover-password.component';
import { RestorePasswordComponent } from '@modals/auth/restore-password/restore-password.component';
import { SignUpComponent } from '@modals/auth/sign-up/sign-up.component';
import { Subject } from 'rxjs';
import { CinemaService } from '@services/cinema.service';

@Injectable( {
    providedIn: 'root'
} )
export class AuthModalsService {

    onLogin = new Subject<boolean>();

    constructor( private modalService: BsModalService,
                 private cinemaService: CinemaService ) { }


    showLoginModal( message?: boolean ) {
        const initialState = {
            message
        };
        const modal = this.modalService.show( LoginComponent, {
            initialState,
            class: 'ModalLogin modal-dialog-centered',
            backdrop: 'static',
            keyboard: false
        } );

        modal.content?.forgotPassword.pipe( take( 1 ) ).subscribe( () => {
            this.showRecoverPasswordModal();
        } );

        modal.content?.register.pipe( take( 1 ) ).subscribe( () => {
            this.showRegisterModal();
        } );

        modal.content?.onLogin.pipe( take( 1 ) ).subscribe( () => {
            this.onLogin.next( true );
        } );
    }

    showRecoverPasswordModal() {
        const modal = this.modalService.show( RecoverPasswordComponent, {
            class: 'ModalRecoverPassword modal-dialog-centered',
            backdrop: 'static',
            keyboard: false
        } );

        modal.content?.login.pipe( take( 1 ) ).subscribe( () => {
            this.showLoginModal();
        } );
    }

    showRestorePasswordModal( token: string, email: string ) {
        const modal = this.modalService.show( RestorePasswordComponent, {
            initialState: { token, email },
            class: 'ModalRecoverPassword modal-dialog-centered',
            backdrop: 'static',
            keyboard: false
        } );

        modal.content?.dataEvt.pipe( take( 1 ) ).subscribe( ( res: any ) => {
            this.showLoginModal( true );
        } );
    }

    showRegisterModal() {
        const modal = this.modalService.show( SignUpComponent, {
            class: 'ModalSignUp modal-dialog-centered',
            backdrop: 'static',
            keyboard: false
        } );

        modal.content?.dataEvt.pipe( take( 1 ) )
        .subscribe( ( res: any ) => {
            this.showLoginModal();
        } );
    }
}
