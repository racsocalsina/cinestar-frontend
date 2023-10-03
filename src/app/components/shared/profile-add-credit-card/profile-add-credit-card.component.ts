import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component( {
    selector: 'app-profile-add-credit-card',
    templateUrl: './profile-add-credit-card.component.html',
    styleUrls: [
        '../profile-list-credit-card/profile-list-credit-card.component.scss',
        './profile-add-credit-card.component.scss'
    ]
} )
export class ProfileAddCreditCardComponent implements OnInit {

    @Output() onAddCard = new EventEmitter();
    @Output() onBack = new EventEmitter();

    constructor() { }

    ngOnInit(): void {
    }

}
