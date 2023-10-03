import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { Utils } from '@utils/utils';
import { FormUtils } from '@utils/form.utils';
import { Documents } from '@utils/enums';
import { CustomValidators } from '@utils/validators.utils';
import { AuthService } from '@services/auth.service';
import { GeneralService } from '@services/general.service';
import { Observable, Subscription } from 'rxjs';
import { DocumentTypeInterface } from '@interfaces/document-type.interface';

import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ModalTermsComponent } from '@components/modals/modal-terms/modal-terms.component';
import { DepartmentInterface } from '@interfaces/ubigeo';
import { UbigeoService } from '@services/ubigeo.service';
import { ContentService } from '@services/content.service';

@Component( {
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: [ './sign-up.component.scss' ]
} )
export class SignUpComponent implements OnInit, OnDestroy {

    dataEvt = new EventEmitter();
    toBegin = Utils.toBeginFilter();
    step = 1;
    form1!: FormGroup;
    form2!: FormGroup;
    Documents = Documents;
    typeDocuments: DocumentTypeInterface[] = [];
    isLoading!: boolean;
    error!: string | null;
    subs: Subscription[] = [];
    info: any;

    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: 'theme-red custom-auth-calendar',
        adaptivePosition: true,
        maxDate: Utils.minDate()
    };
    isPasswordTextFieldType!: boolean;
    isConfirmPasswordTextFieldType!: boolean;

    departments: DepartmentInterface[] = [];

    showModalTerm = false;

    constructor( private localeService: BsLocaleService,
                 private fb: FormBuilder,
                 public bsModalRef: BsModalRef,
                 private socialAuthService: SocialAuthService,
                 private generalService: GeneralService,
                 private authService: AuthService,
                 private modalService: BsModalService,
                 private ubigeoService: UbigeoService,
                 private contentService: ContentService ) {
        defineLocale( 'es', esLocale );
        this.localeService.use( 'es' );
    }

    ngOnInit(): void {
        this.subs.push( this.generalService.getDocumentTypes().subscribe( types => this.typeDocuments = types ) );

        this.subs.push( this.ubigeoService.getUbigeo().subscribe( dpts => this.departments = dpts ) );

        this.createForm();

        this.contentService.getcontent('partner').then((res: any) => {
            this.info = res.data;
        });
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    private createForm(): void {
        this.form1 = this.fb.group( {
            document_type: [ Documents.DNI, Validators.required ],
            document_number: [
                null, [
                    Validators.required,
                    Validators.minLength( 8 ),
                    Validators.maxLength( 8 ),
                    Validators.pattern( /^[0-9]*$/ )
                ]
            ],
            birthdate: [ null, Validators.required ],
            name: [ null, [ Validators.required, Validators.pattern( /^[a-zA-ZáéíóúÁÉÍÓÚÑñ ]*$/ ) ] ],
            lastname: [ null, [ Validators.required, Validators.pattern( /^[a-zA-ZáéíóúÁÉÍÓÚÑñ ]*$/ ) ] ],
        } );

        this.form2 = this.fb.group( {
            email: [ null, [ Validators.required, CustomValidators.isValidEmail ] ],
            cellphone: [
                null, [
                    Validators.required,
                    Validators.pattern( /^[0-9]*$/ ),
                    Validators.minLength( 9 ),
                    Validators.maxLength( 9 ),
                ]
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength( 6 ),
                    Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]{1,})([a-zA-Z0-9]+)$/ )
                ]
            ],
            password_confirmation: [
                '',
                [
                    Validators.required,
                    Validators.minLength( 6 ),
                    Validators.pattern( /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[A-Z]{1,})([a-zA-Z0-9]+)$/ )
                ]
            ],
            checkTerms: [null, Validators.requiredTrue],
            department_id: [null, Validators.required],
        }, { validators: CustomValidators.equalValues( 'password', 'password_confirmation' ) } );
    }

    onClickNext(): void {
        if ( this.step === 1 ) {
            this.form1.markAllAsTouched();
            if ( this.form1.valid ) {
                this.step = 2;
            }
        } else {
            this.form2.markAllAsTouched();
            if ( this.form2.valid ) {
                this.register();
            }
        }
    }

    register(): void {
        this.error = null;
        let params = { ...this.form1.value, ...this.form2.value };
        params = {
            ...params,
            birthdate: Utils.getStringDate( { date: params.birthdate, format: 'YYYY-MM-DD' } )
        };

        this.isLoading = true;
        console.log( params );
        console.log( this.form2.value.checkTerms);

        this.authService.register( params )
            .then( res => {
                console.log( res );
                this.bsModalRef.hide();
                this.dataEvt.emit( true );
            } ).catch( error => {
            console.log( error );
            this.error = error;
        } ).finally( () => this.isLoading = false );
    }

    onClickSignInWithGoogle(): void {
        this.socialAuthService.signIn( GoogleLoginProvider.PROVIDER_ID )
            .then( ( { firstName, lastName, email } ) => {
                this.setUserInfo( firstName, lastName, email );
            } ).catch( console.log );
    }

    onClickSignInWithFB(): void {
        this.socialAuthService
            .signIn( FacebookLoginProvider.PROVIDER_ID )
            .then( ( ( { firstName, lastName, email } ) => {
                this.setUserInfo( firstName, lastName, email );
            } ) ).catch( console.log );
    }

    setUserInfo( name: string, lastName: string, email: string ): void {
        this.form1.get( 'name' )?.setValue( name );
        this.form1.get( 'lastname' )?.setValue( lastName );
        this.form2.get( 'email' )?.setValue( email );
    }

    onChangeSelect(): void {
        const type = this.form1.get( 'document_type' )?.value;
        const control = this.form1.get( 'document_number' );

        if ( control ) {
            FormUtils.validateDocumentType( type, control );
        }
    }


    login() {
        this.bsModalRef.hide();
        this.dataEvt.emit();
    }

    close() {
        if ( !this.isLoading ) {
            this.bsModalRef.hide();
        }
    }

    back() {
        if ( !this.isLoading ) {
            this.step = 1;
        }
    }

    showTerms() {
        if (!this.showModalTerm) {
            this.showModalTerm = true;
            const modal = this.modalService.show(ModalTermsComponent, {
                class: 'modal-terms'
            });

            modal.content?.onAccept.subscribe(() => {
                this.form2.get('checkTerms')?.setValue(true);
                this.showModalTerm = false;
            });

            modal.content?.onClose.subscribe((status: any) => {
                if (status) {
                    this.showModalTerm = false;
                }
            });
        }
    }

    filter() {
        console.log("Hola");
    }
}
