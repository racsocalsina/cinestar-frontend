import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Utils } from '@utils/utils';
import { CreditCardInfoInterface } from '@interfaces/credit-card-info.interface';
import { CreditCards } from '@utils/enums';
import { CreditCardService } from '@services/credit-card.service';
import { CreditCard } from '@models/credit-card.model';
import {environment} from "../../../../environments/environment";
import * as aes from 'crypto-js/aes';
import * as encHex from 'crypto-js/enc-hex'
import * as padZeroPadding from 'crypto-js/pad-zeropadding'


@Component( {
    selector: 'app-form-add-credit-card',
    templateUrl: './form-add-credit-card.component.html',
    styleUrls: ['./form-add-credit-card.component.scss']
} )
export class FormAddCreditCardComponent implements OnInit {

    @Input() showCancel = false;
    @Output() onCancel = new EventEmitter();
    @Output() onAddCard = new EventEmitter<CreditCard>();
    form!: FormGroup;
    creditCardInfo!: CreditCardInfoInterface;
    creditCards = CreditCards;
    isLoading!: boolean;
    error: any;

    constructor( private fb: FormBuilder,
                 private creditCardService: CreditCardService ) { }

    ngOnInit(): void {
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group( {
            number: [null, [Validators.required, Validators.minLength( 16 )]],
            payment_method: [null, Validators.required],
            expiration_date: [null, [Validators.required, Validators.minLength( 4 )]],
            full_name: [null, Validators.required],
        } );
    }

    onChange() {
        const { number } = this.form.value;
        this.creditCardInfo = Utils.getCreditCardType( number );
        this.form.get( 'payment_method' )?.setValue( this.creditCardInfo?.type );

        const control = this.form.get( 'number' );
        control?.setValidators( [
            Validators.required,
            Validators.minLength( this.creditCardInfo?.length || 16 ),
        ] );
    }

    addCard() {
        this.form.markAllAsTouched();
        this.error = null;

        if ( this.form.valid ) {
            const params = this.form.value;
            const m = params.expiration_date.substr( 0, 2 );
            const y = params.expiration_date.substr( 2, 2 );
            params.expiration_date = `${y}/${m}`;

            //console.log( params );

            this.isLoading = true;
            let encryptedData = JSON.stringify(params);
            let key = encHex.parse(environment.encryptionSecretKey);
            let iv =  encHex.parse(environment.encryptionInitializationVector);
            let encrypted = aes.encrypt(encryptedData, key, {iv:iv, padding:padZeroPadding}).toString();
            this.creditCardService.addCreditCard(encrypted)
            .then( creditCard => {
                //console.log( creditCard );
                this.onAddCard.emit( creditCard );
            } ).catch( error => this.error = error )
            .finally( () => this.isLoading = false );
        }

    }
}
