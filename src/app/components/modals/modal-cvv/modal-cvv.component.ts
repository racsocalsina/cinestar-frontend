import { Component, EventEmitter, OnInit } from '@angular/core';
import { CreditCard } from '@models/credit-card.model';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl, Validators } from '@angular/forms';
import { CreditCards } from '@utils/enums';

@Component( {
    selector: 'app-modal-cvv',
    templateUrl: './modal-cvv.component.html',
    styleUrls: ['./modal-cvv.component.scss']
} )
export class ModalCvvComponent implements OnInit {

    dataEvt = new EventEmitter<string>();
    CreditCards = CreditCards;
    card!: CreditCard;
    inputCVV!: FormControl;
    cvvText!: string;
    isLoading: boolean = false;

    constructor( public bsModalRef: BsModalRef ) { }

    ngOnInit(): void {
        this.inputCVV = new FormControl( null, [
            Validators.required, Validators.minLength( this.card.payment_method === CreditCards.Amex ? 4 : 3 )
        ] );

        this.cvvText = this.card.payment_method === CreditCards.Amex ? 'CSC' : 'CVV';
    }

    close() {
        if(!this.isLoading){
            this.isLoading = true;
            this.inputCVV.markAsTouched();
            if ( this.inputCVV.valid ) {
                this.dataEvt.emit( this.inputCVV.value );
                this.bsModalRef.hide();
            }
        }
    }
}
