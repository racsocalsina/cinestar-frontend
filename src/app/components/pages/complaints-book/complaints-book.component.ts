import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '@services/general.service';
import { ClaimParametersInterface } from '@interfaces/claim-parameters.interface';
import { Subscription } from 'rxjs';
import { Documents } from '@utils/enums';
import { CustomValidators } from '@utils/validators.utils';
import { ClaimService } from '@services/claim.service';
import { FormUtils } from '@utils/form.utils';
import { SeoService } from '@services/seo.service';

@Component( {
    selector: 'app-complaints-book',
    templateUrl: './complaints-book.component.html',
    styleUrls: ['./complaints-book.component.scss']
} )
export class ComplaintsBookComponent implements OnInit, OnDestroy {

    step = 1;
    form1!: FormGroup;
    form2!: FormGroup;
    claimParameters!: ClaimParametersInterface;
    subs: Subscription[] = [];
    isLoading = false;
    error?: string;
    claimId!: number;

    constructor( private fb: FormBuilder,
                 private seo: SeoService,
                 private claimService: ClaimService ) {
        seo.setTitle( 'Libro de reclamaciones' );
    }

    ngOnInit(): void {
        this.subs.push( this.claimService.getClaimParameters().subscribe( params => this.claimParameters = params ) );
        this.initForm1();
        this.initForm2();
    }

    ngOnDestroy() {
        this.subs.forEach( s => s.unsubscribe() );
    }

    initForm1() {
        this.form1 = this.fb.group( {
            departments: [null, Validators.required],
            province: [null, Validators.required],
            sede_district_id: [null, Validators.required],
            claim_type_id: [null, Validators.required],
            identification_type_id: [null, Validators.required],
            detail: [null, Validators.required],
            amount: [null, Validators.required]
        } );
    }

    initForm2() {
        this.form2 = this.fb.group( {
            name: [null, Validators.required],
            lastname: [null, Validators.required],
            older: [null, Validators.required],
            document_type_id: [1, Validators.required],
            document_number: [
                null, [
                    Validators.required,
                    Validators.minLength( 8 ),
                    Validators.maxLength( 8 ),
                    Validators.pattern( /^[0-9]*$/ )
                ]
            ],
            address: [null, Validators.required],
            department: [null, Validators.required],
            province: [null, Validators.required],
            person_district_id: [null, Validators.required],
            cellphone: [
                null, [
                    Validators.required,
                    Validators.minLength( 9 ),
                    Validators.maxLength( 9 )
                ]
            ],
            email: [
                null, [
                    Validators.required,
                    CustomValidators.isValidEmail
                ]
            ],

            recaptcha: [null, Validators.required],
        } );
    }


    send( n: number ) {
        if ( n > 0 ) {
            const params = { ...this.form1.value, ...this.form2.value };

            delete params.department;
            delete params.province;
            delete params.recaptcha;

            console.log( params );
            this.isLoading = true;

            this.claimService.save( params ).then( ( res: any ) => {
                this.claimId = res.data.id;
                this.step++;
            } ).catch( error => this.error = error )
            .finally( () => this.isLoading = false );
        } else {
            this.step += n;
        }

    }


}
