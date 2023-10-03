import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { environment } from '../../../../../../environments/environment';
import { ClaimParametersInterface } from '@interfaces/claim-parameters.interface';
import { DepartmentInterface, DistrictInterface, ProvinceInterface } from '@interfaces/ubigeo';
import { Subscription } from 'rxjs';
import { GeneralService } from '@services/general.service';
import { DocumentTypeInterface } from '@interfaces/document-type.interface';
import { Documents } from '@utils/enums';
import { UbigeoService } from '@services/ubigeo.service';
import { FormUtils } from '@utils/form.utils';

@Component( {
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss']
} )
export class Step2Component implements OnInit, OnChanges, OnDestroy {

    @Input() claimParameters!: ClaimParametersInterface;
    @Input() form!: FormGroup;
    @Input() isLoading = false;
    @Input() error?: string;
    @Output() step = new EventEmitter<number>();

    @ViewChild( 'captchaElem' ) captchaElem!: ReCaptcha2Component;
    siteKey = environment.recaptcha_key;
    departments: DepartmentInterface[] = [];
    provinces: ProvinceInterface[] = [];
    districts: DistrictInterface[] = [];
    subs: Subscription[] = [];
    typeDocuments: DocumentTypeInterface[] = [];
    Documents = Documents;


    constructor( private fb: FormBuilder,
                 private ubigeoService: UbigeoService,
                 private generalService: GeneralService ) {
    }

    ngOnInit(): void {
        window.scroll( 0, 0 );
        this.subs.push( this.ubigeoService.getUbigeo().subscribe( departments => this.departments = departments ) );
        this.subs.push( this.generalService.getDocumentTypes().subscribe( types => {
            this.typeDocuments = types;
            console.log( types );
        } ) );

    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    ngOnChanges( changes: SimpleChanges ) {
        console.log( changes );
    }

    handleExpire(): void {
        this.captchaElem.resetCaptcha();
        this.form.get( 'recaptcha' )?.reset();
    }

    handleSuccess( event: string ): void {
        console.log( event );
    }

    onClickBack(): void {
        if ( !this.isLoading ) {
            this.step.emit( -1 );
        }
    }

    onClickNext(): void {
        this.form.markAllAsTouched();
        if ( this.form.valid ) {
            this.step.emit( 1 );
        }
    }

    onChangeDepartment( department: DepartmentInterface ) {
        this.provinces = department.provinces;
        this.districts = [];
        this.form.get( 'province' )?.reset();
        this.form.get( 'person_district_id' )?.reset();
    }

    onChangeProvince( province: ProvinceInterface ) {
        this.districts = province.districts;
        this.form.get( 'person_district_id' )?.reset();
    }

    onChangeOlder( value: any ) {
        if ( value.id === 0 ) {
            this.form.addControl( 'representative_name', new FormControl( null, Validators.required ) );
        } else {
            this.form.removeControl( 'representative_name' );
        }
    }

}
