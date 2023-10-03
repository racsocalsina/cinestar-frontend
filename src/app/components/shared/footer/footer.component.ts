import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../../services/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ContentService} from "@services/content.service";

@Component( {
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
} )
export class FooterComponent implements OnInit {

    form!: FormGroup;
    isLoading!: boolean;
    info: any;
    constructor( private fb: FormBuilder,
                 private contactService: ContactService,
                 private contentService: ContentService) { }

    ngOnInit(): void {
        this.initForm();
        this.contentService.getcontent('partner').then((res: any) => {
            this.info = res.data;
        });
    }

    initForm(): void {
        this.form = this.fb.group( {
            name: [null, Validators.required],
            lastname: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            district_name: [null, Validators.required],
            message: [null, Validators.required]
        } );
    }

    send(): void {
        if ( this.form.valid ) {
            this.isLoading = true;
            this.contactService.sendContactUs( this.form.value )
            .then( res => {
                console.log( res );
                this.form.reset();
                this.contactService.showNotification( {
                    show: true, message: '¡Se ha enviado satisfactoriamente tu mensaje! Pronto nos contactaremos contigo'
                } );
            } ).catch( error => {
                console.log( error );
                this.contactService.showNotification( {
                    show: true, message: 'Ocurrió un error, por favor inténtelo de nuevo',
                    hasError: true
                } );
            } ).finally( () => this.isLoading = false );
        }
    }

}
