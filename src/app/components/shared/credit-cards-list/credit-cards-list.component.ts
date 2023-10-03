import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CreditCard } from '@models/credit-card.model';
import { Observable } from 'rxjs';
import { CreditCardService } from '@services/credit-card.service';
import { Utils } from '@utils/utils';

@Component( {
    selector: 'app-credit-cards-list',
    templateUrl: './credit-cards-list.component.html',
    styleUrls: ['./credit-cards-list.component.scss']
} )
export class CreditCardsListComponent implements OnInit {

    @Input() showRadios = false;
    @Output() onSelectCard = new EventEmitter<CreditCard>();
    @Output() onDeleteCard = new EventEmitter<any>();
    $cards!: Observable<CreditCard[]>;
    isLoading!: boolean;

    constructor( private creditCardService: CreditCardService ) { }

    ngOnInit(): void {
        this.$cards = this.creditCardService.getCreditCards();
    }

    trackByFn( index: number, creditCard: CreditCard ) {
        return creditCard.token;
    }

    delete( token: string ) {
        this.isLoading = true;
        this.creditCardService.deleteCreditCard( token )
        .then( res => {
            this.creditCardService.emitCardDelete(token);
            this.onDeleteCard.emit(token);
            this.creditCardService.getCreditCards();

        } ).catch( error => {
            Utils.showToast( error );
        } ).finally( () => this.isLoading = false );
    }

    onSelect( card: CreditCard ) {
        this.onSelectCard.emit( card );
    }
}
