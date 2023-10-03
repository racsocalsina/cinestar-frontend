import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CreditCardService } from '@services/credit-card.service';

@Component( {
    selector: 'app-profile-list-credit-card',
    templateUrl: './profile-list-credit-card.component.html',
    styleUrls: ['./profile-list-credit-card.component.scss']
} )
export class ProfileListCreditCardComponent implements OnInit, AfterViewChecked {

    @Output() onBack = new EventEmitter();
    @Output() onAddCard = new EventEmitter();


    constructor( public creditCardService: CreditCardService,
                 private changeDetector: ChangeDetectorRef ) { }

    ngOnInit(): void {
    }

    ngAfterViewChecked() { this.changeDetector.detectChanges(); }


}
