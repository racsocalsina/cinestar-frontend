import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ReCaptcha2Component } from 'ngx-captcha';
import { environment } from '../../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '@services/contact.service';
import { Router } from '@angular/router';
import { SeoService } from '@services/seo.service';

@Component( {
    selector: 'app-work-with-us',
    templateUrl: './work-with-us.component.html',
    styleUrls: ['./work-with-us.component.scss']
} )
export class WorkWithUsComponent implements OnInit {
    @ViewChild( 'captchaElem' ) captchaElem!: ReCaptcha2Component;
    siteKey = environment.recaptcha_key;
    form!: FormGroup;
    isLoading!: boolean;
    file!: File;

    constructor( private fb: FormBuilder,
                 private contactService: ContactService,
                 private seo: SeoService,
                 private router: Router ) {
        seo.setTitle( 'Trabaja con nosotros' );
    }

    ngOnInit(): void {
        this.createForm();
        window.scroll( 0, 0 );
    }

    handleExpire(): void {
        this.captchaElem.resetCaptcha();
        /*this.form.get( 'recaptcha' ).reset();*/
    }

    handleSuccess( event: string ): void {
        console.log( event );
        /*this.form.get( 'recaptcha' ).setValue( event );*/
    }

    onSelectFile( file: any ) {
        this.file = file.target.files[ 0 ];
        this.form.controls.cv.setValue( this.file );
        console.log( this.file );
    }

    send() {
        this.form.markAllAsTouched();
        if ( this.form.valid ) {

            let birth_date: string = this.form.value.birth_date;
            birth_date = `${birth_date.substr( 0, 4 )}-${birth_date.substr( 4, 2 )}-${birth_date.substr( 6, 2 )}`;

            this.isLoading = true;
            const formData: FormData = new FormData();
            formData.append( 'cv', this.file );
            formData.append( 'name', this.form.controls.name.value );
            formData.append( 'lastname', this.form.controls.lastname.value );
            formData.append( 'email', this.form.controls.email.value );
            formData.append( 'address', this.form.controls.address.value );
            formData.append( 'document_number', this.form.controls.document_number.value );
            formData.append( 'district_name', this.form.controls.district_name.value );
            formData.append( 'birth_date', birth_date );
            formData.append( 'education_level', this.form.controls.education_level.value );
            console.log( this.form.value );
            this.contactService.sendJobApplications( formData )
            .then( res => {
                console.log( res );
                this.contactService.showNotification( {
                    show: true, message: '¡Se ha enviado satisfactoriamente tu mensaje! Pronto nos contactaremos contigo'
                } );
                setTimeout( () => {
                    this.router.navigate( [''] );
                    this.form.reset();
                }, 4000 );
            } ).catch( error => {
                console.log( error );
                this.contactService.showNotification( {
                    show: true, message: 'Ocurrió un error, por favor inténtelo de nuevo',
                    hasError: true
                } );
            } ).finally( () => this.isLoading = false );
        }
    }

    private createForm(): void {
        this.form = this.fb.group( {
            name: [null, Validators.required],
            lastname: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            address: [null, Validators.required],
            document_number: [null, Validators.required],
            district_name: [null, Validators.required],
            birth_date: [null, Validators.required],
            education_level: [null, Validators.required],
            cv: [null, Validators.required],
            recaptcha: [null, Validators.required],
        } );
    }
}
